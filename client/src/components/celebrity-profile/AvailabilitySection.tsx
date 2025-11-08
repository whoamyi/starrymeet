import { useState } from 'react';

interface AvailabilitySlot {
  id: string;
  meeting_type: 'physical' | 'virtual';
  city?: string;
  date: string;
  time: string;
  duration: number;
  price_cents: number;
  slots_remaining: number;
}

interface AvailabilitySectionProps {
  availability: AvailabilitySlot[];
  onRequestMeeting: (slotId: string, type: string, duration: number, price: number) => void;
}

interface GroupedSlots {
  physical: Record<string, AvailabilitySlot[]>;
  virtual: Record<string, AvailabilitySlot[]>;
}

export const AvailabilitySection = ({
  availability,
  onRequestMeeting,
}: AvailabilitySectionProps) => {
  const [expandedType, setExpandedType] = useState<string | null>(null);
  const [expandedLocations, setExpandedLocations] = useState<Set<string>>(new Set());

  const groupAvailability = (data: AvailabilitySlot[]): GroupedSlots => {
    const physical: Record<string, AvailabilitySlot[]> = {};
    const virtual: Record<string, AvailabilitySlot[]> = {};

    // Ensure data is an array before iterating
    if (!Array.isArray(data)) {
      return { physical, virtual };
    }

    data.forEach((slot) => {
      if (slot.meeting_type === 'physical') {
        const city = slot.city || 'Unknown';
        if (!physical[city]) physical[city] = [];
        physical[city].push(slot);
      } else if (slot.meeting_type === 'virtual') {
        const date = slot.date;
        if (!virtual[date]) virtual[date] = [];
        virtual[date].push(slot);
      }
    });

    return { physical, virtual };
  };

  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'Time TBD';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const toggleMeetingType = (type: string) => {
    setExpandedType(expandedType === type ? null : type);
  };

  const toggleLocation = (locationId: string) => {
    const newExpanded = new Set(expandedLocations);
    if (newExpanded.has(locationId)) {
      newExpanded.delete(locationId);
    } else {
      newExpanded.add(locationId);
    }
    setExpandedLocations(newExpanded);
  };

  // Ensure availability is an array
  const availabilityArray = Array.isArray(availability) ? availability : [];

  if (availabilityArray.length === 0) {
    return (
      <div className="availability-section">
        <h2 className="section-title">Availability</h2>
        <div id="availability-container">
          <p className="no-availability">No availability at this time</p>
        </div>
      </div>
    );
  }

  const grouped = groupAvailability(availabilityArray);

  return (
    <div className="availability-section">
      <h2 className="section-title">Availability</h2>
      <div id="availability-container">
        {/* Physical Meetings */}
        {Object.keys(grouped.physical).length > 0 && (
          <MeetingTypeSection
            type="physical"
            title="Physical Meetings"
            groupedSlots={grouped.physical}
            expanded={expandedType === 'physical'}
            expandedLocations={expandedLocations}
            onToggleType={toggleMeetingType}
            onToggleLocation={toggleLocation}
            onRequestMeeting={onRequestMeeting}
            formatDateDisplay={formatDateDisplay}
            formatTime={formatTime}
          />
        )}

        {/* Virtual Meetings */}
        {Object.keys(grouped.virtual).length > 0 && (
          <MeetingTypeSection
            type="virtual"
            title="Virtual Meetings"
            groupedSlots={grouped.virtual}
            expanded={expandedType === 'virtual'}
            expandedLocations={expandedLocations}
            onToggleType={toggleMeetingType}
            onToggleLocation={toggleLocation}
            onRequestMeeting={onRequestMeeting}
            formatDateDisplay={formatDateDisplay}
            formatTime={formatTime}
          />
        )}
      </div>
    </div>
  );
};

interface MeetingTypeSectionProps {
  type: string;
  title: string;
  groupedSlots: Record<string, AvailabilitySlot[]>;
  expanded: boolean;
  expandedLocations: Set<string>;
  onToggleType: (type: string) => void;
  onToggleLocation: (locationId: string) => void;
  onRequestMeeting: (slotId: string, type: string, duration: number, price: number) => void;
  formatDateDisplay: (date: string) => string;
  formatTime: (time: string) => string;
}

const MeetingTypeSection = ({
  type,
  title,
  groupedSlots,
  expanded,
  expandedLocations,
  onToggleType,
  onToggleLocation,
  onRequestMeeting,
  formatDateDisplay,
  formatTime,
}: MeetingTypeSectionProps) => {
  const locations = Object.keys(groupedSlots);

  return (
    <div className="meeting-type-group">
      <button
        className="meeting-type-header"
        onClick={() => onToggleType(type)}
        aria-expanded={expanded}
      >
        <span className="meeting-type-title">{title}</span>
        <svg
          className={`chevron-icon ${expanded ? 'expanded' : ''}`}
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className="meeting-type-content"
        id={`${type}-content`}
        style={{ display: expanded ? 'block' : 'none' }}
      >
        {locations.map((locationKey, index) => {
          const slots = groupedSlots[locationKey];
          const locationId = `${type}-${locationKey.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${index}`;

          return (
            <LocationPackage
              key={locationId}
              type={type}
              locationKey={locationKey}
              locationId={locationId}
              slots={slots}
              expanded={expandedLocations.has(locationId)}
              onToggle={onToggleLocation}
              onRequestMeeting={onRequestMeeting}
              formatDateDisplay={formatDateDisplay}
              formatTime={formatTime}
            />
          );
        })}
      </div>
    </div>
  );
};

interface LocationPackageProps {
  type: string;
  locationKey: string;
  locationId: string;
  slots: AvailabilitySlot[];
  expanded: boolean;
  onToggle: (locationId: string) => void;
  onRequestMeeting: (slotId: string, type: string, duration: number, price: number) => void;
  formatDateDisplay: (date: string) => string;
  formatTime: (time: string) => string;
}

const LocationPackage = ({
  type,
  locationKey,
  locationId,
  slots,
  expanded,
  onToggle,
  onRequestMeeting,
  formatDateDisplay,
  formatTime,
}: LocationPackageProps) => {
  const totalTickets = slots.reduce((sum, slot) => sum + (Number(slot.slots_remaining) || 0), 0);
  const ticketText = totalTickets === 1 ? 'ticket' : 'tickets';

  return (
    <>
      <button
        className="location-package"
        onClick={() => onToggle(locationId)}
        aria-expanded={expanded}
      >
        <div className="package-header">
          <div className="package-info">
            {type === 'physical' ? (
              <svg
                className="icon-location"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            ) : (
              <svg
                className="icon-calendar"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            )}
            <span className="location-name">{locationKey}</span>
          </div>
          <div className="package-meta">
            <span className="ticket-count">
              🎟️ {totalTickets} {ticketText}
            </span>
            <svg
              className={`chevron-sm ${expanded ? 'expanded' : ''}`}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </div>
        </div>
      </button>
      <div
        className="ticket-units"
        id={`${locationId}-tickets`}
        style={{ display: expanded ? 'block' : 'none' }}
      >
        {slots.map((slot, index) => (
          <TicketUnit
            key={slot.id || `${type}-${index}`}
            type={type}
            slot={slot}
            onRequestMeeting={onRequestMeeting}
            formatDateDisplay={formatDateDisplay}
            formatTime={formatTime}
          />
        ))}
      </div>
    </>
  );
};

interface TicketUnitProps {
  type: string;
  slot: AvailabilitySlot;
  onRequestMeeting: (slotId: string, type: string, duration: number, price: number) => void;
  formatDateDisplay: (date: string) => string;
  formatTime: (time: string) => string;
}

const TicketUnit = ({
  type,
  slot,
  onRequestMeeting,
  formatDateDisplay,
  formatTime,
}: TicketUnitProps) => {
  const price = slot.price_cents ? `$${(slot.price_cents / 100).toLocaleString()}` : 'Price TBD';

  return (
    <div className="ticket-unit">
      <div className="ticket-details">
        <div className="ticket-datetime">
          {type === 'physical' ? (
            <>
              <svg
                className="icon-calendar"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="date-text">{formatDateDisplay(slot.date)}</span>
            </>
          ) : null}
          <svg
            className="icon-clock"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="time-text">{formatTime(slot.time)}</span>
          <span className="duration-pill">{slot.duration} min</span>
        </div>
        <div className="ticket-actions">
          <span className="ticket-price">{price}</span>
          <button
            className="btn-ticket-request"
            onClick={() =>
              onRequestMeeting(slot.id, type, slot.duration, slot.price_cents || 0)
            }
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};
