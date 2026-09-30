'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, Info, Images, FileQuestion, ExternalLink } from 'lucide-react';
import { EventDetailsForm } from './EventDetailsForm';
import { EventGalleryManager } from './EventGalleryManager';
import { EventFormFieldsManager } from './EventFormFieldsManager';

interface EventEditorClientProps {
  event: any;
  images: any[];
  formFields: any[];
}

export const EventEditorClient: React.FC<EventEditorClientProps> = ({
  event,
  images,
  formFields,
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'gallery' | 'form'>('details');

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/admin/events"
            className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back to Events List</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase font-sans">
            EDIT: {event.title}
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Slug: /{event.slug} · Created: {new Date(event.created_at).toLocaleDateString()}
          </p>
        </div>

        <Link
          href={`/events?event=${event.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-bold shrink-0 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </Link>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-200/80 overflow-x-auto pb-px scrollbar-none">
        {[
          { id: 'details', label: 'Event Details', shortLabel: 'Details', icon: Info },
          { id: 'gallery', label: `Gallery (${images.length})`, shortLabel: `Gallery`, icon: Images },
          { id: 'form', label: `Form Fields (${formFields.length})`, shortLabel: 'Form', icon: FileQuestion },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 sm:px-4 py-3 border-b-2 text-xs font-mono font-bold tracking-wider uppercase transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                isActive
                  ? 'border-[#0F4C2A] text-[#0F4C2A]'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span className="hidden xs:inline sm:hidden lg:inline">{tab.label}</span>
              <span className="xs:hidden sm:inline lg:hidden">{tab.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'details' && (
          <EventDetailsForm initialData={event} isNew={false} />
        )}

        {activeTab === 'gallery' && (
          <EventGalleryManager
            eventId={event.id}
            coverImageUrl={event.cover_image_url}
            initialImages={images}
          />
        )}

        {activeTab === 'form' && (
          <EventFormFieldsManager
            eventId={event.id}
            initialFields={formFields}
          />
        )}
      </div>
    </div>
  );
};
