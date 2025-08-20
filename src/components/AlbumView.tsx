// components/AlbumView.tsx
import React, { useState } from "react";
import Image from "next/image";
import { ArrowLeft, Plus, Edit, Trash2, Download, Eye } from "lucide-react";
import { Button, Modal, FormField } from "./ui";
import { useAppState } from "../hooks/useAppState";
import { useNotification } from "../hooks/useNotification";
import { Pictures, Album } from "../types";

interface AlbumViewProps {
  albumId: string;
  onBack: () => void;
}

export const AlbumView: React.FC<AlbumViewProps> = ({ albumId, onBack }) => {
  const { albums, setAlbums, pictures, setPictures } = useAppState();
  const { showNotification } = useNotification();

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<Pictures | null>(null);
  const [pictureForm, setPictureForm] = useState({
    title: "",
    description: "",
    tags: "",
    imageFile: null as File | null,
    imageUrl: "",
  });

  const album = albums.find((a: Album) => a.id === albumId);
  const albumPictures = pictures.filter((p: Pictures) => p.albumId === albumId);

  if (!album) {
    return <div>Album not found</div>;
  }

  const generateId = () => Date.now().toString() + Math.random();

  const updatePictureForm = (
    field: keyof typeof pictureForm,
    value: string | File
  ) => {
    setPictureForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetPictureForm = () => {
    setPictureForm({
      title: "",
      description: "",
      tags: "",
      imageFile: null,
      imageUrl: "",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        showNotification("File size must be less than 10MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPictureForm((prev) => ({
          ...prev,
          imageFile: file,
          imageUrl: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addPicture = () => {
    const { title, description, tags, imageUrl } = pictureForm;

    if (!title) {
      showNotification("Please enter picture title", "error");
      return;
    }

    if (!imageUrl) {
      showNotification("Please select an image", "error");
      return;
    }

    const picture: Pictures = {
      id: generateId(),
      albumId,
      title,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      imageUrl,
      uploadedBy: "Current User", // You can make this dynamic
      uploadedAt: new Date().toISOString().split("T")[0],
      likes: 0,
      views: 0,
    };

    setPictures((prev: Pictures[]) => [...prev, picture]);

    // Update album image count and set cover image if first picture
    setAlbums((prev: Album[]) =>
      prev.map((a: Album) =>
        a.id === albumId
          ? {
              ...a,
              imageCount: a.imageCount + 1,
              coverImage: a.coverImage || imageUrl,
            }
          : a
      )
    );

    resetPictureForm();
    setAddModalOpen(false);
    showNotification("Picture added successfully!", "success");
  };

  const editPicture = () => {
    if (!selectedPicture) return;

    const { title, description, tags } = pictureForm;

    if (!title) {
      showNotification("Please enter picture title", "error");
      return;
    }

    setPictures((prev: Pictures[]) =>
      prev.map((p: Pictures) =>
        p.id === selectedPicture.id
          ? {
              ...p,
              title,
              description,
              tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            }
          : p
      )
    );

    resetPictureForm();
    setEditModalOpen(false);
    setSelectedPicture(null);
    showNotification("Picture updated successfully!", "success");
  };

  const deletePicture = (pictureId: string) => {
    if (window.confirm("Are you sure you want to delete this picture?")) {
      setPictures((prev: Pictures[]) =>
        prev.filter((p: Pictures) => p.id !== pictureId)
      );

      // Update album image count
      setAlbums((prev: Album[]) =>
        prev.map((a: Album) =>
          a.id === albumId
            ? { ...a, imageCount: Math.max(0, a.imageCount - 1) }
            : a
        )
      );

      showNotification("Picture deleted successfully!", "success");
    }
  };

  const openEditModal = (picture: Pictures) => {
    setSelectedPicture(picture);
    setPictureForm({
      title: picture.title,
      description: picture.description,
      tags: picture.tags.join(", "),
      imageFile: null,
      imageUrl: picture.imageUrl,
    });
    setEditModalOpen(true);
  };

  const openViewModal = (picture: Pictures) => {
    setSelectedPicture(picture);
    // Increment view count
    setPictures((prev: Pictures[]) =>
      prev.map((p: Pictures) =>
        p.id === picture.id ? { ...p, views: p.views + 1 } : p
      )
    );
    setViewModalOpen(true);
  };

  const downloadImage = (imageUrl: string, title: string) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = `${title}.jpg`;
    link.click();
  };

  const likePicture = (pictureId: string) => {
    setPictures((prev: Pictures[]) =>
      prev.map((p: Pictures) =>
        p.id === pictureId ? { ...p, likes: p.likes + 1 } : p
      )
    );
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="secondary">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Albums</span>
            </Button>
            <div>
              <h2 className="text-2xl font-semibold text-slate-800">
                {album.name}
              </h2>
              <p className="text-slate-600">{album.description}</p>
            </div>
          </div>
          <Button onClick={() => setAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span>Add Picture</span>
          </Button>
        </div>

        {/* Album Stats */}
        <div className="bg-white rounded-2xl soft-shadow p-6">
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {albumPictures.length}
              </div>
              <div className="text-sm text-slate-600">Pictures</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {albumPictures.reduce(
                  (sum: number, p: Pictures) => sum + p.likes,
                  0
                )}
              </div>
              <div className="text-sm text-slate-600">Total Likes</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {albumPictures.reduce(
                  (sum: number, p: Pictures) => sum + p.views,
                  0
                )}
              </div>
              <div className="text-sm text-slate-600">Total Views</div>
            </div>
          </div>
        </div>

        {/* Pictures Grid */}
        {albumPictures.length === 0 ? (
          <div className="bg-white rounded-2xl soft-shadow p-12 text-center">
            <div className="text-slate-400 mb-4">
              <Plus className="h-16 w-16 mx-auto mb-4" />
            </div>
            <h3 className="text-xl font-semibold text-slate-600 mb-2">
              No pictures yet
            </h3>
            <p className="text-slate-500 mb-6">
              Start building your album by adding some pictures
            </p>
            <Button onClick={() => setAddModalOpen(true)}>
              Add First Picture
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albumPictures.map((picture) => (
              <div
                key={picture.id}
                className="bg-white rounded-2xl soft-shadow overflow-hidden group"
              >
                <div className="relative">
                  <Image
                    src={picture.imageUrl}
                    alt={picture.title}
                    width={300}
                    height={300}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => openViewModal(picture)}
                  />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                    <button
                      onClick={() => openEditModal(picture)}
                      className="p-2 bg-white/90 rounded-full text-slate-600 hover:bg-white hover:text-blue-600 transition-colors"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deletePicture(picture.id)}
                      className="p-2 bg-white/90 rounded-full text-slate-600 hover:bg-white hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <h4 className="font-semibold text-slate-800 mb-2 truncate">
                    {picture.title}
                  </h4>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                    {picture.description}
                  </p>

                  {picture.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {picture.tags
                        .slice(0, 3)
                        .map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      {picture.tags.length > 3 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{picture.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm text-slate-500">
                    <span>By {picture.uploadedBy}</span>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => likePicture(picture.id)}
                        className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                      >
                        <span>❤️</span>
                        <span>{picture.likes}</span>
                      </button>
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{picture.views}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Picture Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Picture"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {pictureForm.imageUrl && (
              <div className="mt-3">
                <Image
                  src={pictureForm.imageUrl}
                  alt="Preview"
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg"
                />
              </div>
            )}
          </div>

          <FormField
            label="Picture Title"
            value={pictureForm.title}
            onChange={(value) => updatePictureForm("title", value)}
            placeholder="Enter picture title"
            required
          />

          <FormField
            label="Description"
            value={pictureForm.description}
            onChange={(value) => updatePictureForm("description", value)}
            placeholder="Picture description"
            isTextarea
            rows={3}
          />

          <FormField
            label="Tags"
            value={pictureForm.tags}
            onChange={(value) => updatePictureForm("tags", value)}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => setAddModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={addPicture}>Add Picture</Button>
        </div>
      </Modal>

      {/* Edit Picture Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Picture"
      >
        <div className="space-y-4">
          {selectedPicture && (
            <div className="mb-4">
              <Image
                src={selectedPicture.imageUrl}
                alt={selectedPicture.title}
                width={400}
                height={160}
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          )}

          <FormField
            label="Picture Title"
            value={pictureForm.title}
            onChange={(value) => updatePictureForm("title", value)}
            placeholder="Enter picture title"
            required
          />

          <FormField
            label="Description"
            value={pictureForm.description}
            onChange={(value) => updatePictureForm("description", value)}
            placeholder="Picture description"
            isTextarea
            rows={3}
          />

          <FormField
            label="Tags"
            value={pictureForm.tags}
            onChange={(value) => updatePictureForm("tags", value)}
            placeholder="Enter tags separated by commas"
          />
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => setEditModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={editPicture}>Update Picture</Button>
        </div>
      </Modal>

      {/* View Picture Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedPicture?.title || ""}
      >
        {selectedPicture && (
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={selectedPicture.imageUrl}
                alt={selectedPicture.title}
                width={600}
                height={384}
                className="w-full max-h-96 object-contain rounded-lg"
              />
              <button
                onClick={() =>
                  downloadImage(selectedPicture.imageUrl, selectedPicture.title)
                }
                className="absolute top-2 right-2 p-2 bg-white/90 rounded-full text-slate-600 hover:bg-white hover:text-blue-600 transition-colors"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-slate-700 mb-3">
                {selectedPicture.description}
              </p>

              {selectedPicture.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedPicture.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t">
                <div>
                  <span>Uploaded by {selectedPicture.uploadedBy}</span>
                  <span className="mx-2">•</span>
                  <span>{selectedPicture.uploadedAt}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => likePicture(selectedPicture.id)}
                    className="flex items-center space-x-1 hover:text-red-500 transition-colors"
                  >
                    <span>❤️</span>
                    <span>{selectedPicture.likes} likes</span>
                  </button>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{selectedPicture.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
