// components/AlbumView.tsx - Updated to display photos and add delete functionality
"use client";

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

  const album = albums.find((a: Album) => a._id === albumId);
  const albumPictures = pictures.filter((p: Pictures) => p.albumId === albumId);

  if (!album) {
    return <div>Album not found</div>;
  }

  const generateId = () => Date.now().toString() + Math.random();

  const updatePictureForm = (
    field: keyof typeof pictureForm,
    value: string | File | null
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

  const addPicture = async () => {
    const { title, description, tags, imageFile, imageUrl } = pictureForm;
    if (!title || !imageFile) {
      showNotification("Please fill in all required fields", "error");
      return;
    }

    // In a real application, you would upload the file and get a URL.
    // We'll simulate this with a FileReader.
    const reader = new FileReader();
    reader.onload = () => {
      const newPicture: Pictures = {
        id: generateId(),
        albumId: albumId,
        title,
        description,
        imageUrl: reader.result as string,
        tags: tags.split(",").map((tag) => tag.trim()),
        uploadedAt: new Date().toLocaleDateString(),
        uploadedBy: "You",
        likes: 0,
        views: 0,
      };

      setPictures((prev) => [...prev, newPicture]);
      showNotification(`Picture '${title}' added successfully!`, "success");
      setAddModalOpen(false);
      resetPictureForm();
    };
    reader.readAsDataURL(imageFile);
  };

  const deletePicture = (id: string, title: string) => {
    if (
      window.confirm(`Are you sure you want to delete the photo '${title}'?`)
    ) {
      setPictures((prev) => prev.filter((p) => p.id !== id));
      showNotification(`Photo '${title}' deleted successfully.`, "success");
    }
  };

  const openViewModal = (picture: Pictures) => {
    setSelectedPicture(picture);
    setViewModalOpen(true);
  };

  return (
    <>
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-full border border-reminisce-gray-300 text-reminisce-gray-600 hover:bg-reminisce-gray-100 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-3xl font-poppins font-bold text-reminisce-gray-800">
          {album.name}
        </h1>
        <Button onClick={() => setAddModalOpen(true)} className="ml-auto">
          <Plus className="h-5 w-5 mr-2" />
          Add Photo
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {albumPictures.length === 0 && (
          <div className="text-center py-16 col-span-full">
            <h3 className="text-xl font-poppins font-semibold text-reminisce-gray-700 mb-2">
              No photos in this album yet.
            </h3>
            <p className="text-reminisce-gray-500 font-poppins">
              Start by adding your first photo.
            </p>
          </div>
        )}
        {albumPictures.map((picture) => (
          <div
            key={picture.id}
            className="group relative rounded-lg overflow-hidden shadow-md"
          >
            <div
              onClick={() => openViewModal(picture)}
              className="cursor-pointer"
            >
              <Image
                src={picture.imageUrl}
                alt={picture.title}
                width={400}
                height={300}
                objectFit="cover"
                className="w-full h-64 transition-transform duration-300 transform group-hover:scale-110"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex space-x-2">
                <button
                  onClick={() => deletePicture(picture.id, picture.title)}
                  className="p-3 bg-white/30 text-white rounded-full backdrop-blur-sm hover:bg-red-500 transition-colors"
                  aria-label={`Delete photo ${picture.title}`}
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="absolute top-3 right-3 p-1.5 bg-black/50 text-white rounded-md text-xs backdrop-blur-sm">
              {picture.title}
            </div>
          </div>
        ))}
      </div>

      {/* Add Photo Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="Add New Photo"
      >
        <div className="space-y-4">
          <FormField
            label="Photo Title"
            value={pictureForm.title}
            onChange={(value) => updatePictureForm("title", value)}
            placeholder="Enter photo title"
            required
          />
          <FormField
            label="Description"
            value={pictureForm.description}
            onChange={(value) => updatePictureForm("description", value)}
            placeholder="Photo description (optional)"
            isTextarea
            rows={3}
          />
          <FormField
            label="Tags (comma separated)"
            value={pictureForm.tags}
            onChange={(value) => updatePictureForm("tags", value)}
            placeholder="e.g., event, travel, food"
          />
          <label className="block text-sm font-medium text-reminisce-gray-700">
            Image File
          </label>
          <input
            type="file"
            onChange={(e) =>
              updatePictureForm(
                "imageFile",
                e.target.files ? e.target.files[0] : null
              )
            }
            className="block w-full text-sm text-reminisce-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-reminisce-purple-50 file:text-reminisce-purple-700 hover:file:bg-reminisce-purple-100"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={() => setAddModalOpen(false)} variant="secondary">
            Cancel
          </Button>
          <Button onClick={addPicture}>Add Photo</Button>
        </div>
      </Modal>

      {/* View Photo Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title={selectedPicture?.title || ""}
      >
        {selectedPicture && (
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1">
              <Image
                src={selectedPicture.imageUrl}
                alt={selectedPicture.title}
                width={1000}
                height={800}
                objectFit="contain"
                className="rounded-lg max-h-[70vh] w-full"
              />
            </div>
            <div className="w-full md:w-80 flex-shrink-0">
              <h3 className="text-2xl font-poppins font-bold text-reminisce-gray-800 mb-2">
                {selectedPicture.title}
              </h3>
              <p className="text-reminisce-gray-600 mb-4">
                {selectedPicture.description}
              </p>
              {selectedPicture.tags && selectedPicture.tags.length > 0 && (
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
                  <span>Uploaded by {selectedPicture.uploadedBy || "You"}</span>
                  <span className="mx-2"> • </span>
                  <span>{selectedPicture.uploadedAt}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {}} // No-op for a mock like button
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
