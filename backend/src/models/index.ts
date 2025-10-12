import User from './User';
import Celebrity from './Celebrity';
import Booking from './Booking';
import Payment from './Payment';
import Review from './Review';

// Define associations
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

export {
  User,
  Celebrity,
  Booking,
  Payment,
  Review
};
