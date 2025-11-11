import User from './User';
import Celebrity from './Celebrity';
import Booking from './Booking';
import Payment from './Payment';
import Review from './Review';
import UserSession from './UserSession';
import PaymentMethod from './PaymentMethod';
import Message from './Message';
import UserPreference from './UserPreference';
import SavedCelebrity from './SavedCelebrity';
import Conversation from './Conversation';

// Existing associations
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Celebrity.hasMany(Booking, { foreignKey: 'celebrity_id' });
Booking.belongsTo(Celebrity, { foreignKey: 'celebrity_id' });

Booking.hasOne(Payment, { foreignKey: 'booking_id' });
Payment.belongsTo(Booking, { foreignKey: 'booking_id' });

Booking.hasOne(Review, { foreignKey: 'booking_id' });
Review.belongsTo(Booking, { foreignKey: 'booking_id' });

User.hasMany(Review, { foreignKey: 'user_id' });
Review.belongsTo(User, { foreignKey: 'user_id' });

Celebrity.hasMany(Review, { foreignKey: 'celebrity_id' });
Review.belongsTo(Celebrity, { foreignKey: 'celebrity_id' });

// New associations for dashboard features
User.hasMany(UserSession, { foreignKey: 'user_id' });
UserSession.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(PaymentMethod, { foreignKey: 'user_id' });
PaymentMethod.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Message, { foreignKey: 'from_user_id', as: 'sentMessages' });
User.hasMany(Message, { foreignKey: 'to_user_id', as: 'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'from_user_id', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'to_user_id', as: 'recipient' });

Booking.hasMany(Message, { foreignKey: 'booking_id' });
Message.belongsTo(Booking, { foreignKey: 'booking_id' });

User.hasOne(UserPreference, { foreignKey: 'user_id' });
UserPreference.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(SavedCelebrity, { foreignKey: 'user_id' });
SavedCelebrity.belongsTo(User, { foreignKey: 'user_id' });

Celebrity.hasMany(SavedCelebrity, { foreignKey: 'celebrity_id' });
SavedCelebrity.belongsTo(Celebrity, { foreignKey: 'celebrity_id' });

// Conversation associations
User.hasMany(Conversation, { foreignKey: 'user_id' });
Conversation.belongsTo(User, { foreignKey: 'user_id' });

Celebrity.hasMany(Conversation, { foreignKey: 'celebrity_id' });
Conversation.belongsTo(Celebrity, { foreignKey: 'celebrity_id' });

Celebrity.hasMany(Message, { foreignKey: 'celebrity_id' });
Message.belongsTo(Celebrity, { foreignKey: 'celebrity_id' });

export {
  User,
  Celebrity,
  Booking,
  Payment,
  Review,
  UserSession,
  PaymentMethod,
  Message,
  UserPreference,
  SavedCelebrity,
  Conversation
};
