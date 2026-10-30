// RideNHop Domain Models - Null safe & production-grade

enum UserRole { ridee, rider }

enum RideStage {
  idle,
  searching,
  riderAssigned,
  riderApproaching,
  riderArrived,
  inTrip,
  approachingDestination,
  completed,
}

enum DeliveryStage {
  idle,
  requestPlaced,
  courierAssigned,
  headingToPickup,
  collected,
  inTransit,
  delivered,
}

class LocationItem {
  final String id;
  final String name;
  final String address;
  final double x; // Map percentage 0..100
  final double y; // Map percentage 0..100

  const LocationItem({
    required this.id,
    required this.name,
    required this.address,
    required this.x,
    required this.y,
  });
}

class RideOption {
  final String id;
  final String name;
  final String tagline;
  final double price;
  final int etaMinutes;
  final int travelMinutes;
  final String bikeType;

  const RideOption({
    required this.id,
    required this.name,
    required this.tagline,
    required this.price,
    required this.etaMinutes,
    required this.travelMinutes,
    required this.bikeType,
  });
}

class RiderProfile {
  final String id;
  final String name;
  final double rating;
  final int totalTrips;
  final String bikeModel;
  final String registrationNumber;
  final String phone;
  final bool verified;

  const RiderProfile({
    required this.id,
    required this.name,
    required this.rating,
    required this.totalTrips,
    required this.bikeModel,
    required this.registrationNumber,
    required this.phone,
    this.verified = true,
  });
}

class RideBookingRecord {
  final String id;
  final String reference;
  final RideOption rideOption;
  final LocationItem pickup;
  final LocationItem destination;
  final double fare;
  final double tip;
  final int rating;
  final String createdAt;
  final RiderProfile rider;

  const RideBookingRecord({
    required this.id,
    required this.reference,
    required this.rideOption,
    required this.pickup,
    required this.destination,
    required this.fare,
    this.tip = 0.0,
    this.rating = 5,
    required this.createdAt,
    required this.rider,
  });
}

class OfferItem {
  final String code;
  final String title;
  final String description;
  final String discountValue;
  final String expiry;

  const OfferItem({
    required this.code,
    required this.title,
    required this.description,
    required this.discountValue,
    required this.expiry,
  });
}

class IncomingJob {
  final String id;
  final String type; // 'ride' or 'delivery'
  final String customerName;
  final double customerRating;
  final String pickupName;
  final String destinationName;
  final double earnings;
  final int durationMinutes;

  const IncomingJob({
    required this.id,
    required this.type,
    required this.customerName,
    required this.customerRating,
    required this.pickupName,
    required this.destinationName,
    required this.earnings,
    required this.durationMinutes,
  });
}
