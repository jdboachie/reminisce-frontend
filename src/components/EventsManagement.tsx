"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  Building,
  Users,
  MoreVertical,
  Eye,
  Trash2,
  Edit3,
  MapPin,
  Clock,
  Star,
} from "lucide-react";
import { Button, Modal, FormField } from "./ui";
import {
  Event as EventType,
  CreateEventPayload,
  UpdateEventPayload,
} from "../types";
import { eventAPI } from "../utils/api";
import { API_CONFIG, authenticatedApiCall } from "@/config/api";
import { useNotification } from "../hooks/useNotification";

interface EventsManagementProps {
  adminToken?: string;
  departmentInfo?: {
    name: string;
    code: string;
    slug: string;
  };
}

export const EventsManagement: React.FC<EventsManagementProps> = ({
  adminToken,
  departmentInfo,
}) => {
  const { showNotification } = useNotification();
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [eventForm, setEventForm] = useState<CreateEventPayload>({
    title: "",
    description: "",
    venue: "",
    eventDate: "",
  });

  // Load events when component mounts or admin token changes
  useEffect(() => {
    if (adminToken) {
      loadEvents();
    }
  }, [adminToken]);

  // Update department in eventForm when departmentInfo changes
  useEffect(() => {
    if (departmentInfo?.name) {
      setEventForm((prev) => ({ ...prev, department: departmentInfo.name }));
    }
  }, [departmentInfo]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!adminToken) {
        throw new Error("Admin token not available");
      }

      // Use workspace-based endpoint (no department name needed)
      const endpoint = API_CONFIG.ENDPOINTS.GET_EVENTS;
      console.log("🔍 EventsManagement - Loading events for admin department");

      const response = await authenticatedApiCall(endpoint, adminToken, {
        method: "GET",
      });

      console.log("🔍 EventsManagement - Response status:", response.status);
      console.log("🔍 EventsManagement - Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("🔍 EventsManagement - Error response:", errorText);
        throw new Error(`Failed to load events: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("🔍 EventsManagement - Events data received:", result);

      if (result.success && result.data) {
        // Backend returns events in result.data.events
        const eventsData = result.data.events || result.data;
        setEvents(eventsData);
        console.log(`🔍 EventsManagement - Loaded ${eventsData.length} events`);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (err) {
      console.error("🔍 EventsManagement - Error loading events:", err);
      setError(err instanceof Error ? err.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const updateEventForm = (field: keyof CreateEventPayload, value: string) => {
    setEventForm((prev) => ({ ...prev, [field]: value }));
  };

  const resetEventForm = () => {
    setEventForm({
      title: "",
      description: "",
      venue: "",
      eventDate: "",
    });
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    try {
      setSubmitting(true);
      setError(null);

      // Validate that all required fields are filled
      if (
        !eventForm.title.trim() ||
        !eventForm.description.trim() ||
        !eventForm.venue.trim() ||
        !eventForm.eventDate
      ) {
        throw new Error("Please fill in all required fields");
      }

      // Validate that the event date is in the future
      const selectedDate = new Date(eventForm.eventDate);
      const now = new Date();
      if (selectedDate <= now) {
        throw new Error("Event date must be in the future");
      }

      // Department will be automatically set from JWT token
      const eventPayload = {
        ...eventForm,
      };

      console.log("Sending event payload:", eventPayload);
      console.log("Event form state:", eventForm);
      console.log("Department info:", departmentInfo);
      console.log("Admin token:", adminToken ? "Present" : "Missing");
      console.log("API endpoint:", API_CONFIG.ENDPOINTS.CREATE_EVENT);
      console.log("Date type:", typeof eventForm.eventDate);
      console.log("Date value:", eventForm.eventDate);

      const newEvent = await authenticatedApiCall(
        API_CONFIG.ENDPOINTS.CREATE_EVENT,
        adminToken,
        {
          method: "POST",
          body: JSON.stringify(eventPayload),
        }
      );

      if (!newEvent.ok) {
        const errorData = await newEvent.json().catch(() => ({}));
        console.error("Backend error response:", errorData);
        if (errorData.details && errorData.details.length > 0) {
          console.error("Validation error details:", errorData.details);
          const validationError = errorData.details[0];
          throw new Error(
            `Validation error: ${
              validationError.message || "Invalid data format"
            }`
          );
        }
        throw new Error(
          `Failed to create event: ${newEvent.statusText} - ${
            errorData.msg || "Unknown error"
          }`
        );
      }

      const createdEvent = await newEvent.json();

      // Show success message first
      showNotification("Event created successfully!", "success");

      // Reset form and close modal
      resetEventForm();
      setModalOpen(false);

      // Refresh events list to show the new event
      await loadEvents();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create event";
      setError(errorMessage);
      showNotification(errorMessage, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken || !editingEvent) return;

    try {
      setSubmitting(true);
      setError(null);

      const targetId = editingEvent._id || (editingEvent as any).id;
      if (!targetId) {
        throw new Error("Cannot update event: missing event identifier");
      }
      const updatedEvent = await eventAPI.updateEvent(
        targetId,
        eventForm,
        adminToken
      );
      setEvents((prev) =>
        prev.map((e) =>
          (e._id || (e as any).id) === targetId ? updatedEvent : e
        )
      );

      resetEventForm();
      setEditModalOpen(false);
      setEditingEvent(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!adminToken || !confirm("Are you sure you want to delete this event?"))
      return;

    try {
      await eventAPI.deleteEvent(eventId, adminToken);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
      setDropdownOpen(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event");
    }
  };

  const openEditModal = (event: EventType) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      venue: event.venue || "",
      eventDate: event.eventDate || "",
    });
    setEditModalOpen(true);
    setDropdownOpen(null);
  };

  const getEventStatusColor = (status: EventType["status"]) => {
    const colors = {
      upcoming: "from-indigo-500 via-purple-500 to-pink-500",
      ongoing: "from-emerald-400 via-cyan-500 to-blue-500",
      completed: "from-gray-400 via-gray-500 to-gray-600",
      cancelled: "from-red-400 via-red-500 to-red-600",
    };
    return colors[status];
  };

  const getEventStatusBadge = (status: EventType["status"]) => {
    const badges = {
      upcoming: "bg-indigo-50 text-indigo-700 border-indigo-200",
      ongoing: "bg-emerald-50 text-emerald-700 border-emerald-200",
      completed: "bg-gray-50 text-gray-700 border-gray-200",
      cancelled: "bg-red-50 text-red-700 border-red-200",
    };
    return badges[status];
  };

  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatEventTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleDropdown = (eventId: string) => {
    setDropdownOpen(dropdownOpen === eventId ? null : eventId);
  };

  const viewEventDetails = (event: EventType) => {
    setSelectedEvent(event);
    setDetailsModalOpen(true);
    setDropdownOpen(null);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setDropdownOpen(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  if (!adminToken) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please log in to manage events.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Events Management
            </h2>
            <p className="text-slate-600 mt-1">
              Create and manage events for{" "}
              {departmentInfo?.name || "your department"}
            </p>
            <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-700">
                <strong>✓ Department Integration:</strong> Events are now
                automatically filtered by your department (
                {departmentInfo?.name || "Current Department"})
              </p>
              {departmentInfo && (
                <div className="mt-2 text-xs text-green-600">
                  <p>Department Code: {departmentInfo.code}</p>
                  <p>Department Slug: {departmentInfo.slug}</p>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => loadEvents()}
              variant="secondary"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              disabled={loading}
            >
              <div className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}>
                {loading ? "⟳" : "⟳"}
              </div>
              <span>Refresh</span>
            </Button>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              <span>Create Event</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.length}
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {
                    events.filter((e) => e.status === "upcoming" || !e.status)
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Clock className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ongoing</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter((e) => e.status === "ongoing").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter((e) => e.status === "completed").length}
                </p>
              </div>
              <div className="p-3 bg-gray-100 rounded-full">
                <Calendar className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-5 h-5 bg-red-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Error loading events
                  </h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={() => loadEvents()}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
            <p className="text-sm text-gray-500 mt-2">
              Please wait while we fetch the latest events
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events yet
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by creating your first event
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600"
            >
              <Plus className="h-4 w-4" />
              <span>Create Your First Event</span>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event._id}
                className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Status Header */}
                <div
                  className={`h-1 bg-gradient-to-r ${getEventStatusColor(
                    event.status
                  )}`}
                ></div>

                <div className="p-6">
                  {/* Header with Title and Menu */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                        {event.title}
                      </h3>
                    </div>
                    <div className="relative ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(event._id || (event as any).id);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-400" />
                      </button>

                      {dropdownOpen === event._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => viewEventDetails(event)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-3 text-gray-400" />
                            View Details
                          </button>
                          <button
                            onClick={() => openEditModal(event)}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <Edit3 className="h-4 w-4 mr-3 text-gray-400" />
                            Edit Event
                          </button>
                          <hr className="my-2" />
                          <button
                            onClick={() =>
                              handleDeleteEvent(event._id || (event as any).id)
                            }
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 className="h-4 w-4 mr-3" />
                            Delete Event
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {event.description && (
                    <p className="text-sm text-slate-600 mb-6 line-clamp-2">
                      {event.description}
                    </p>
                  )}

                  {/* Event Details */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-slate-600">
                      <div className="flex items-center justify-center w-8 h-8 bg-indigo-50 rounded-full mr-3">
                        <Calendar className="h-4 w-4 text-indigo-600" />
                      </div>
                      <span className="text-sm font-medium">
                        {event.eventDate
                          ? `${formatEventDate(
                              event.eventDate
                            )} at ${formatEventTime(event.eventDate)}`
                          : "Date not set"}
                      </span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center text-slate-600">
                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-50 rounded-full mr-3">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                        </div>
                        <span className="text-sm font-medium truncate">
                          {event.venue}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="mb-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border ${getEventStatusBadge(
                        event.status
                      )}`}
                    >
                      {event.status === "upcoming" && (
                        <Star className="h-3 w-3 mr-1" />
                      )}
                      {event.status === "ongoing" && (
                        <Clock className="h-3 w-3 mr-1" />
                      )}
                      {event.status}
                    </span>
                  </div>

                  {/* Quick Action Button */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => viewEventDetails(event)}
                      className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 py-2 px-4 rounded-xl font-medium text-sm transition-all duration-200"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Event"
      >
        <form onSubmit={handleCreateEvent} className="space-y-6">
          <div className="text-center pb-4 border-b border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Create New Event
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Fill in the details to create your event
            </p>
          </div>

          <FormField
            label="Event Title"
            value={eventForm.title}
            onChange={(value) => updateEventForm("title", value)}
            placeholder="e.g., Community Meetup, Workshop, Conference"
            required
          />

          <FormField
            label="Description"
            value={eventForm.description}
            onChange={(value) => updateEventForm("description", value)}
            placeholder="Describe what this event is about..."
            isTextarea
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date & Time"
              type="datetime-local"
              value={eventForm.eventDate}
              onChange={(value) => updateEventForm("eventDate", value)}
              required
            />
            <FormField
              label="Venue"
              value={eventForm.venue}
              onChange={(value) => updateEventForm("venue", value)}
              placeholder="e.g., Conference Hall, Online, Community Center"
              required
            />
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-700">
              <strong>Note:</strong> This event will be created for department:{" "}
              <span className="font-semibold">
                {departmentInfo?.name || "General"}
              </span>
            </p>
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
            <Button
              onClick={() => setModalOpen(false)}
              variant="secondary"
              className="px-6"
            >
              Cancel
            </Button>
            <Button
              disabled={submitting}
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6"
            >
              {submitting ? "Creating..." : "Create Event"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Event"
      >
        <form onSubmit={handleUpdateEvent} className="space-y-6">
          <div className="text-center pb-4 border-b border-gray-100">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-3">
              <Edit3 className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Edit Event</h3>
            <p className="text-gray-600 text-sm mt-1">
              Update the event details
            </p>
          </div>

          <FormField
            label="Event Title"
            value={eventForm.title}
            onChange={(value) => updateEventForm("title", value)}
            placeholder="e.g., Community Meetup, Workshop, Conference"
            required
          />

          <FormField
            label="Description"
            value={eventForm.description}
            onChange={(value) => updateEventForm("description", value)}
            placeholder="Describe what this event is about..."
            isTextarea
            rows={4}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Date & Time"
              type="datetime-local"
              value={eventForm.eventDate}
              onChange={(value) => updateEventForm("eventDate", value)}
              required
            />
            <FormField
              label="Venue"
              value={eventForm.venue}
              onChange={(value) => updateEventForm("venue", value)}
              placeholder="e.g., Conference Hall, Online, Community Center"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}
        </form>

        <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-100">
          <Button
            onClick={() => setEditModalOpen(false)}
            variant="secondary"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleUpdateEvent(new Event("submit") as any)}
            disabled={submitting}
            className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 px-6"
          >
            {submitting ? "Updating..." : "Update Event"}
          </Button>
        </div>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title=""
        maxWidth="4xl"
      >
        {selectedEvent && (
          <div className="space-y-6">
            {/* Event Header */}
            <div className="text-center pb-4 border-b border-gray-100">
              <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
                <Calendar className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {selectedEvent.title}
              </h2>
              <span
                className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full border ${getEventStatusBadge(
                  selectedEvent.status
                )}`}
              >
                {selectedEvent.status === "upcoming" && (
                  <Star className="h-4 w-4 mr-2" />
                )}
                {selectedEvent.status === "ongoing" && (
                  <Clock className="h-4 w-4 mr-2" />
                )}
                {selectedEvent.status}
              </span>
            </div>

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    About This Event
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {selectedEvent?.description ||
                      "No description provided for this event."}
                  </p>
                </div>

                {/* Event Timeline */}
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Event Details
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          Event Date & Time
                        </h4>
                        <p className="text-gray-600">
                          {selectedEvent?.eventDate
                            ? `${formatEventDate(
                                selectedEvent.eventDate
                              )} at ${formatEventTime(selectedEvent.eventDate)}`
                            : "Date not set"}
                        </p>
                      </div>
                    </div>
                    {selectedEvent?.venue && (
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <MapPin className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            Location
                          </h4>
                          <p className="text-gray-600">{selectedEvent.venue}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-gray-900">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (selectedEvent) {
                          openEditModal(selectedEvent);
                          setDetailsModalOpen(false);
                        }
                      }}
                      disabled={!selectedEvent}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Edit3 className="h-4 w-4" />
                      <span>Edit Event</span>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedEvent?._id) {
                          handleDeleteEvent(selectedEvent._id);
                          setDetailsModalOpen(false);
                        }
                      }}
                      disabled={!selectedEvent?._id}
                      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete Event</span>
                    </button>
                  </div>
                </div>

                {/* Event Stats */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Event Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Event ID</span>
                      <span className="text-sm font-mono text-gray-900">
                        {selectedEvent?._id
                          ? `#${selectedEvent._id.slice(-8)}`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {selectedEvent?.status || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm text-gray-900">
                        {selectedEvent?.createdAt
                          ? new Date(
                              selectedEvent.createdAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">
                        Last Updated
                      </span>
                      <span className="text-sm text-gray-900">
                        {selectedEvent?.updatedAt
                          ? new Date(
                              selectedEvent.updatedAt
                            ).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </div>
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
