const requirements = [
  {
    icon: '📋',
    title: 'Identity Verification',
    description:
      'Valid government-issued ID required. All fans are verified for celebrity safety.',
  },
  {
    icon: '🎫',
    title: 'Booking Confirmation',
    description:
      'Submit your request with payment. Celebrity approves within 48 hours. Full refund if declined.',
  },
  {
    icon: '📸',
    title: 'Meeting Etiquette',
    description:
      'Respectful behavior required. Photos allowed (ask first). No recording without consent.',
  },
  {
    icon: '⏱️',
    title: 'Punctuality',
    description:
      'Arrive 10 minutes early. Late arrivals may result in shortened meeting time.',
  },
];

export const MeetingRequirementsSection = () => {
  return (
    <section className="requirements-section-new">
      <div className="requirements-container-new">
        <h2 className="section-title">Meeting Requirements</h2>

        <div className="requirements-list-new">
          {requirements.map((req, index) => (
            <div key={index} className="requirement-item-new">
              <div className="requirement-icon-new">{req.icon}</div>
              <div className="requirement-content-new">
                <h4 className="requirement-title-new">{req.title}</h4>
                <p className="requirement-description-new">{req.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
