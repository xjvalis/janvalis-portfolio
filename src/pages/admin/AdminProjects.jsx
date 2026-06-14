import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Plus, Pencil, Trash2, Eye, EyeOff, Star, StarOff, GripVertical, AlertCircle } from 'lucide-react';
import ProjectForm from './ProjectForm';

// Admin reads directly from the imported JSON for display,
// but all edits produce a downloadable updated JSON for the user to commit to GitHub.
import projectsDataRaw from '@/data/projects.json';

export default function AdminProjects() {
  const [projects, setProjects] = useState(() =>
    [...projectsDataRaw].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  );
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const markChanged = (newProjects) => {
    setProjects(newProjects);
    setHasChanges(true);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(projects);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    const reordered = items.map((p, i) => ({ ...p, sortOrder: i }));
    markChanged(reordered);
  };

  const handleToggleVisible = (id) => {
    markChanged(projects.map(p =>
      p.id === id ? { ...p, isVisible: p.isVisible === false ? true : false } : p
    ));
  };

  const handleToggleFeatured = (id) => {
    markChanged(projects.map(p =>
      p.id === id ? { ...p, featured: !p.featured } : p
    ));
  };

  const handleDelete = (id, title) => {
    if (confirm(`Delete "${title}"?`)) {
      markChanged(projects.filter(p => p.id !== id));
    }
  };

  const handleSave = (savedProject) => {
    if (editingProject) {
      markChanged(projects.map(p => p.id === savedProject.id ? savedProject : p));
    } else {
      const newId = String(Date.now());
      const maxOrder = projects.reduce((max, p) => Math.max(max, p.sortOrder ?? 0), 0);
      markChanged([...projects, { ...savedProject, id: newId, sortOrder: maxOrder + 1 }]);
    }
    setShowForm(false);
    setEditingProject(null);
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(projects, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'projects.json';
    a.click();
    URL.revokeObjectURL(url);
    setHasChanges(false);
  };

  return (
    <div className="p-8 md:p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-white text-3xl font-semibold">Projects</h1>
          <p className="text-white/30 text-[11px] uppercase tracking-widest mt-1">
            {projects.length} total · drag to reorder
          </p>
        </div>
        <div className="flex items-center gap-3">
          {hasChanges && (
            <button
              onClick={downloadJSON}
              className="flex items-center gap-2 bg-green-500 text-black px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-green-400 transition-colors"
            >
              ↓ Download projects.json
            </button>
          )}
          <button
            onClick={() => { setEditingProject(null); setShowForm(true); }}
            className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-[11px] font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors"
          >
            <Plus size={14} />
            Add Project
          </button>
        </div>
      </div>

      {hasChanges && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 px-5 py-4 mb-8">
          <AlertCircle size={15} className="text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-yellow-300 text-[12px] font-medium tracking-wider">Neuložené změny</p>
            <p className="text-yellow-300/60 text-[11px] tracking-wider mt-1">
              Klikni na "Download projects.json", nahraj soubor do GitHubu do <code className="text-yellow-300/80">src/data/projects.json</code> a web se automaticky aktualizuje.
            </p>
          </div>
        </div>
      )}

      <div className="scan-line mb-8" />

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-px">
              {projects.map((project, i) => (
                <Draggable key={project.id} draggableId={project.id} index={i}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`flex items-center gap-4 py-4 px-4 transition-colors group ${
                        snapshot.isDragging ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div
                        {...provided.dragHandleProps}
                        className="text-white/20 hover:text-white/50 transition-colors flex-shrink-0 cursor-grab active:cursor-grabbing"
                      >
                        <GripVertical size={16} />
                      </div>

                      <div className="w-16 h-10 bg-white/10 flex-shrink-0 overflow-hidden">
                        {project.thumbnailUrl && (
                          <img src={project.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-white text-[13px] font-medium truncate">{project.title}</p>
                        <p className="text-white/40 text-[11px] uppercase tracking-wider mt-0.5">
                          {project.clientBrand && `${project.clientBrand} · `}
                          {project.category}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-widest px-2 py-1 ${
                          project.isVisible !== false ? 'text-blue-400 bg-blue-400/10' : 'text-white/20 bg-white/5'
                        }`}>
                          {project.isVisible !== false ? 'Visible' : 'Hidden'}
                        </span>
                        {project.featured && (
                          <span className="text-[10px] uppercase tracking-widest px-2 py-1 text-yellow-400/80 bg-yellow-400/10">
                            Featured
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleToggleFeatured(project.id)}
                          className="p-2 text-white/30 hover:text-yellow-400 transition-colors"
                          title="Toggle featured (Home page)"
                        >
                          {project.featured ? <Star size={14} /> : <StarOff size={14} />}
                        </button>
                        <button
                          onClick={() => handleToggleVisible(project.id)}
                          className="p-2 text-white/30 hover:text-white transition-colors"
                          title="Toggle visibility"
                        >
                          {project.isVisible !== false ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>
                        <button
                          onClick={() => { setEditingProject(project); setShowForm(true); }}
                          className="p-2 text-white/30 hover:text-blue-400 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id, project.title)}
                          className="p-2 text-white/30 hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <AnimatePresence>
        {showForm && (
          <ProjectForm
            project={editingProject}
            onClose={() => { setShowForm(false); setEditingProject(null); }}
            onSaved={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
