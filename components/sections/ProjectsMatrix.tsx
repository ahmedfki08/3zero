'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FEATURED_PROJECTS } from '@/content/club-data';
import { Project, PillarId } from '@/types';
import { Layers, ArrowUpRight, X } from 'lucide-react';
import { GithubIcon } from '../ui/SocialIcons';

export const ProjectsMatrix: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | PillarId>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filteredProjects =
    activeFilter === 'all'
      ? FEATURED_PROJECTS
      : FEATURED_PROJECTS.filter((p) => p.pillarId === activeFilter);

  return (
    <section id="projects" className="py-24 bg-[#FAFCFA] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8F7EE] border border-[#3FA85B]/30 text-[#0F4C2A] text-xs font-mono mb-3 font-bold">
              <Layers className="w-3.5 h-3.5 text-[#3FA85B]" />
              <span>ISIMS INNOVATION LAB</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight uppercase">
              STUDENT-BUILT <span className="text-[#3FA85B]">PROTOTYPES</span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: 'All Projects' },
              { id: 'exclusion', label: '01 Exclusion' },
              { id: 'carbon', label: '02 Carbon' },
              { id: 'poverty', label: '03 Poverty' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as 'all' | PillarId)}
                className={`px-4 py-2 rounded-full text-xs font-mono transition-all ${
                  activeFilter === f.id
                    ? 'bg-[#3FA85B] text-white font-bold shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                onClick={() => setSelectedProject(project)}
                className="group relative rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-7 flex flex-col justify-between hover:border-[#3FA85B]/60 hover:shadow-xl hover:shadow-[#3FA85B]/5 transition-all duration-300 cursor-pointer shadow-sm"
              >
                <div className="space-y-4">
                  {/* Top status bar */}
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#E8F7EE] text-[#0F4C2A] border border-[#3FA85B]/20">
                      {project.pillarLabel}
                    </span>

                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {project.status}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#3FA85B] transition-colors leading-tight">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.techStack.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {t}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="text-[10px] font-mono text-slate-400 px-1 py-0.5">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">Lead</span>
                    <span className="text-slate-700 font-semibold">{project.leadStudent.split('(')[0]}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-slate-400 block text-[9px] uppercase">Impact Outcome</span>
                    <span className="text-[#3FA85B] font-bold">{project.metricsAchieved}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProject(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative z-10 max-w-xl w-full rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-mono uppercase text-[#3FA85B] tracking-wider font-bold">
                    {selectedProject.pillarLabel} • {selectedProject.status}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 mt-1">
                    {selectedProject.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-700 leading-relaxed">
                {selectedProject.summary}
              </p>

              <div className="p-4 rounded-2xl bg-[#FAFCFA] border border-slate-200 space-y-2">
                <div className="text-xs font-mono uppercase text-slate-500 font-bold">
                  Verified Metric & Key Result
                </div>
                <div className="text-lg font-bold text-[#0F4C2A]">
                  {selectedProject.impactScore}
                </div>
                <div className="text-xs font-mono text-slate-500">
                  Lead: {selectedProject.leadStudent}
                </div>
              </div>

              <div>
                <div className="text-xs font-mono uppercase text-slate-500 mb-2">
                  Full Tech Stack
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.techStack.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-xl text-xs font-mono bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-2 border border-slate-200 transition-colors"
                  >
                    <GithubIcon className="w-4 h-4" />
                    <span>View Repository</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="px-5 py-2 rounded-xl text-xs font-mono bg-[#3FA85B] text-white font-bold hover:bg-[#0F4C2A]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
