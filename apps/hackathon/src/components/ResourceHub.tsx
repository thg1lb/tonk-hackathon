import React, { useState } from 'react';
import { useResourceStore, ResourceType } from '../stores/resourceStore';
import { useTaskStore } from '../stores/taskStore';
import { useUserStore } from '../stores/userStore';

export const ResourceHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [newResource, setNewResource] = useState({
    title: '',
    type: 'link' as ResourceType,
    content: '',
    relatedTaskId: '',
    tags: [] as string[],
  });
  const [newTag, setNewTag] = useState('');

  const { resources, addResource, removeResource, searchResources } = useResourceStore();
  const { tasks } = useTaskStore();
  const currentUserId = useUserStore.getState().users[0]?.id || 'unknown';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newResource.title && newResource.content) {
      addResource({
        ...newResource,
        createdBy: currentUserId,
        tags: newResource.tags,
      });
      setNewResource({
        title: '',
        type: 'link',
        content: '',
        relatedTaskId: '',
        tags: [],
      });
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      setNewResource({
        ...newResource,
        tags: [...newResource.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewResource({
      ...newResource,
      tags: newResource.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const displayedResources = searchQuery
    ? searchResources(searchQuery)
    : resources;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Add New Resource</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={newResource.title}
              onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              value={newResource.type}
              onChange={(e) => setNewResource({ ...newResource, type: e.target.value as ResourceType })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="link">Link</option>
              <option value="file">File</option>
              <option value="note">Note</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            {newResource.type === 'note' ? (
              <textarea
                value={newResource.content}
                onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={4}
                required
              />
            ) : (
              <input
                type={newResource.type === 'file' ? 'file' : 'text'}
                value={newResource.content}
                onChange={(e) => setNewResource({ ...newResource, content: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Related Task</label>
            <select
              value={newResource.relatedTaskId}
              onChange={(e) => setNewResource({ ...newResource, relatedTaskId: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">None</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>
                  {task.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {newResource.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Add Resource
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Resources</h2>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-4">
          {displayedResources.map((resource) => {
            const relatedTask = tasks.find((t) => t.id === resource.relatedTaskId);
            const creator = useUserStore.getState().getUser(resource.createdBy);
            
            return (
              <div key={resource.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{resource.title}</h3>
                    <p className="text-sm text-gray-500">
                      Type: {resource.type} | Added by: {creator?.name || 'Unknown'} |{' '}
                      {new Date(resource.createdAt).toLocaleString()}
                    </p>
                    
                    <div className="mt-2">
                      {resource.type === 'link' ? (
                        <a
                          href={resource.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resource.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{resource.content}</p>
                      )}
                    </div>

                    {relatedTask && (
                      <p className="text-sm text-blue-600 mt-2">
                        Related Task: {relatedTask.title}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap gap-2">
                      {resource.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => removeResource(resource.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
