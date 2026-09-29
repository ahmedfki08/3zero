'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import {
  Upload,
  Trash2,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Image as ImageIcon,
  Star,
  ExternalLink,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
}

interface EventGalleryManagerProps {
  eventId: string;
  coverImageUrl?: string | null;
  initialImages: GalleryItem[];
}

export const EventGalleryManager: React.FC<EventGalleryManagerProps> = ({
  eventId,
  coverImageUrl,
  initialImages,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [images, setImages] = useState<GalleryItem[]>(initialImages);
  const [currentCover, setCurrentCover] = useState<string | null>(coverImageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setStatusMsg(null);

    const supabase = createClient();

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Validate size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`File "${file.name}" exceeds the 5MB size limit.`);
        }

        // Validate type
        if (!file.type.startsWith('image/')) {
          throw new Error(`File "${file.name}" is not a valid image format.`);
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
        const filePath = `events/${eventId}/${fileName}`;

        // 1. Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('event-media')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        // 2. Get Public URL
        const { data: publicUrlData } = supabase.storage
          .from('event-media')
          .getPublicUrl(filePath);

        const publicUrl = publicUrlData.publicUrl;

        // 3. Insert into event_images table
        const { data: imageRecord, error: dbError } = await supabase
          .from('event_images')
          .insert({
            event_id: eventId,
            url: publicUrl,
            alt_text: file.name.replace(/\.[^/.]+$/, ''),
            sort_order: images.length + i,
          })
          .select('id, url, alt_text, sort_order')
          .single();

        if (dbError) throw dbError;

        if (imageRecord) {
          setImages((prev) => [...prev, imageRecord]);
          // If no cover image exists, auto-assign first uploaded image
          if (!currentCover) {
            await handleSetCover(publicUrl);
          }
        }
      }

      setStatusMsg({ type: 'success', text: 'Photos successfully uploaded to gallery!' });
      router.refresh();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setStatusMsg({ type: 'error', text: err.message || 'Image upload failed.' });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Set Cover Image
  const handleSetCover = async (url: string) => {
    setCurrentCover(url);
    const supabase = createClient();
    await supabase.from('events').update({ cover_image_url: url }).eq('id', eventId);
    setStatusMsg({ type: 'success', text: 'Cover photo updated!' });
    router.refresh();
  };

  // Delete Image
  const handleDeleteImage = async (imageItem: GalleryItem) => {
    const supabase = createClient();

    // 1. Delete from event_images table
    const { error: dbError } = await supabase
      .from('event_images')
      .delete()
      .eq('id', imageItem.id);

    if (dbError) {
      setStatusMsg({ type: 'error', text: dbError.message });
      return;
    }

    setImages((prev) => prev.filter((img) => img.id !== imageItem.id));

    // If deleting current cover image, clear it
    if (currentCover === imageItem.url) {
      setCurrentCover(null);
      await supabase.from('events').update({ cover_image_url: null }).eq('id', eventId);
    }

    setStatusMsg({ type: 'success', text: 'Image removed from gallery.' });
    router.refresh();
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 font-mono uppercase">
            Sprint Photo Gallery &amp; Cover Media
          </h3>
          <p className="text-xs font-sans text-slate-500 mt-0.5">
            Upload high-resolution sprint photos (max 5MB per file) stored securely in Supabase.
          </p>
        </div>

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-2xl bg-[#0F4C2A] hover:bg-[#3FA85B] text-white text-xs font-mono font-bold uppercase transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Upload Photos</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Status feedback */}
      {statusMsg && (
        <div
          className={`p-3.5 rounded-2xl text-xs font-sans flex items-center gap-2.5 ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-[#3FA85B]" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
            <ImageIcon className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700">No images uploaded yet</p>
            <p className="text-xs text-slate-400 font-sans">
              Click &quot;Upload Photos&quot; to upload sprint banners, workshop setups, and prototype captures.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img) => {
            const isCover = currentCover === img.url;

            return (
              <div
                key={img.id}
                className={`relative group rounded-2xl overflow-hidden border-2 bg-slate-900 transition-all ${
                  isCover ? 'border-[#3FA85B] shadow-md ring-2 ring-[#3FA85B]/20' : 'border-slate-200'
                }`}
              >
                {/* Image Display */}
                <div className="relative w-full h-40">
                  <Image
                    src={img.url}
                    alt={img.alt_text || 'Event photo'}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2" />
                </div>

                {/* Badge if Cover */}
                {isCover && (
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-[#3FA85B] text-white text-[10px] font-mono font-bold uppercase shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" />
                    <span>Cover</span>
                  </div>
                )}

                {/* Action Bar */}
                <div className="p-2.5 bg-white border-t border-slate-100 flex items-center justify-between gap-1">
                  {!isCover ? (
                    <button
                      type="button"
                      onClick={() => handleSetCover(img.url)}
                      className="text-[11px] font-mono font-bold text-slate-600 hover:text-[#0F4C2A] flex items-center gap-1"
                    >
                      <Star className="w-3.5 h-3.5 text-slate-400" />
                      <span>Set as Cover</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-mono font-bold text-[#3FA85B]">
                      Main Banner
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleDeleteImage(img)}
                    title="Delete Photo"
                    className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
