// RideNHop App State Management - ChangeNotifier with granular updates
import 'package:flutter/foundation.dart';
import '../models/models.dart';

class AppStateManager extends ChangeNotifier {
  // Navigation & Role
  UserRole _currentRole = UserRole.ridee;
  int _currentTabIndex = 0;

  UserRole get currentRole => _currentRole;
  int get currentTabIndex => _currentTabIndex;

  // Driver Status
  bool _isRiderOnline = true;
  double _riderEarningsToday = 68.40;
  double _riderBalance = 142.80;
  int _completedRidesCount = 6;
  int _completedDeliveriesCount = 4;

  bool get isRiderOnline => _isRiderOnline;
  double get riderEarningsToday => _riderEarningsToday;
  double get riderBalance => _riderBalance;
  int get completedRidesCount => _completedRidesCount;
  int get completedDeliveriesCount => _completedDeliveriesCount;

  // Passenger Status
  double _passengerWalletBalance = 38.50;
  RideStage _rideStage = RideStage.idle;
  DeliveryStage _deliveryStage = DeliveryStage.idle;
  RideBookingRecord? _activeRide;
  IncomingJob? _activeRiderJob;

  double get passengerWalletBalance => _passengerWalletBalance;
  RideStage get rideStage => _rideStage;
  DeliveryStage get deliveryStage => _deliveryStage;
  RideBookingRecord? get activeRide => _activeRide;
  IncomingJob? get activeRiderJob => _activeRiderJob;

  // Preset Mock Locations
  static const List<LocationItem> mockLocations = [
    LocationItem(id: 'loc_piccadilly', name: 'Manchester Piccadilly Approach', address: 'Piccadilly Station, M1 2PB', x: 50, y: 55),
    LocationItem(id: 'loc_oxford', name: 'University of Manchester', address: 'Oxford Road, M13 9PL', x: 75, y: 35),
    LocationItem(id: 'loc_ancoats', name: 'Ancoats Square Marina', address: 'Redhill St, M4 6EJ', x: 38, y: 48),
    LocationItem(id: 'loc_mediacity', name: 'MediaCityUK Studio Dock', address: 'Salford Quays, M50 2EQ', x: 82, y: 65),
  ];

  static const List<RideOption> mockRideOptions = [
    RideOption(id: 'standard', name: 'Standard Moto-Pass', tagline: 'Fastest in gridlock traffic', price: 4.80, etaMinutes: 2, travelMinutes: 8, bikeType: 'Honda CB500F'),
    RideOption(id: 'comfort', name: 'Comfort Cruiser', tagline: 'Top-box luggage & backrest', price: 6.80, etaMinutes: 4, travelMinutes: 9, bikeType: 'Yamaha Tracer 7'),
    RideOption(id: 'express', name: 'Express Speed-Pass', tagline: 'Priority lane filtering pilot', price: 8.50, etaMinutes: 1, travelMinutes: 6, bikeType: 'Yamaha MT-07'),
  ];

  static const RiderProfile defaultRider = RiderProfile(
    id: 'rider_jordan',
    name: 'Jordan Lee',
    rating: 4.94,
    totalTrips: 1420,
    bikeModel: 'Yamaha MT-07 (Dark Stealth)',
    registrationNumber: 'MT23 RDE',
    phone: '+44 7911 882244',
  );

  List<IncomingJob> _incomingRequests = [
    const IncomingJob(
      id: 'job_1',
      type: 'ride',
      customerName: 'Marcus Vance',
      customerRating: 4.9,
      pickupName: 'St Peter\'s Square Library',
      destinationName: 'Salford Central Station',
      earnings: 7.20,
      durationMinutes: 9,
    ),
    const IncomingJob(
      id: 'job_2',
      type: 'delivery',
      customerName: 'Sarah Jenkins',
      customerRating: 5.0,
      pickupName: 'Northern Quarter Pharmacy',
      destinationName: 'Deansgate Towers',
      earnings: 5.80,
      durationMinutes: 6,
    ),
  ];

  List<IncomingJob> get incomingRequests => List.unmodifiable(_incomingRequests);

  List<RideBookingRecord> _pastRides = [
    const RideBookingRecord(
      id: 'bk_past_1',
      reference: 'RH-8821',
      rideOption: mockRideOptions[0],
      pickup: mockLocations[0],
      destination: mockLocations[1],
      fare: 5.20,
      tip: 2.00,
      rating: 5,
      createdAt: 'Today, 11:45',
      rider: defaultRider,
    ),
    const RideBookingRecord(
      id: 'bk_past_2',
      reference: 'RH-6490',
      rideOption: mockRideOptions[1],
      pickup: mockLocations[2],
      destination: mockLocations[3],
      fare: 7.80,
      tip: 1.50,
      rating: 5,
      createdAt: 'Yesterday, 17:20',
      rider: defaultRider,
    ),
  ];

  List<RideBookingRecord> get pastRides => List.unmodifiable(_pastRides);

  // Actions
  void switchRole(UserRole newRole) {
    if (_currentRole != newRole) {
      _currentRole = newRole;
      _currentTabIndex = 0;
      notifyListeners();
    }
  }

  void setTabIndex(int index) {
    if (_currentTabIndex != index) {
      _currentTabIndex = index;
      notifyListeners();
    }
  }

  void toggleRiderOnline(bool online) {
    _isRiderOnline = online;
    notifyListeners();
  }

  void topUpWallet(double amount) {
    if (amount > 0) {
      _passengerWalletBalance = double.parse((_passengerWalletBalance + amount).toStringAsFixed(2));
      notifyListeners();
    }
  }

  void requestPayout(double amount) {
    if (amount > 0 && amount <= _riderBalance) {
      _riderBalance = double.parse((_riderBalance - amount).toStringAsFixed(2));
      notifyListeners();
    }
  }

  void startRideBooking(RideOption option, LocationItem pickup, LocationItem destination) {
    _activeRide = RideBookingRecord(
      id: 'bk_${DateTime.now().millisecondsSinceEpoch}',
      reference: 'RH-${1000 + (DateTime.now().millisecond % 9000)}',
      rideOption: option,
      pickup: pickup,
      destination: destination,
      fare: option.price,
      createdAt: 'Just now',
      rider: defaultRider,
    );
    _rideStage = RideStage.searching;
    notifyListeners();
  }

  void advanceRideStage() {
    switch (_rideStage) {
      case RideStage.searching:
        _rideStage = RideStage.riderAssigned;
        break;
      case RideStage.riderAssigned:
        _rideStage = RideStage.riderApproaching;
        break;
      case RideStage.riderApproaching:
        _rideStage = RideStage.riderArrived;
        break;
      case RideStage.riderArrived:
        _rideStage = RideStage.inTrip;
        break;
      case RideStage.inTrip:
        _rideStage = RideStage.approachingDestination;
        break;
      case RideStage.approachingDestination:
        _rideStage = RideStage.completed;
        if (_activeRide != null) {
          _pastRides.insert(0, _activeRide!);
          _passengerWalletBalance = (_passengerWalletBalance >= _activeRide!.fare)
              ? double.parse((_passengerWalletBalance - _activeRide!.fare).toStringAsFixed(2))
              : _passengerWalletBalance;
        }
        break;
      case RideStage.completed:
      case RideStage.idle:
        _rideStage = RideStage.idle;
        _activeRide = null;
        break;
    }
    notifyListeners();
  }

  void cancelActiveRide() {
    _rideStage = RideStage.idle;
    _activeRide = null;
    notifyListeners();
  }

  void acceptJob(IncomingJob job) {
    _activeRiderJob = job;
    _incomingRequests.removeWhere((r) => r.id == job.id);
    notifyListeners();
  }

  void completeActiveJob() {
    if (_activeRiderJob != null) {
      _riderEarningsToday = double.parse((_riderEarningsToday + _activeRiderJob!.earnings).toStringAsFixed(2));
      _riderBalance = double.parse((_riderBalance + _activeRiderJob!.earnings).toStringAsFixed(2));
      if (_activeRiderJob!.type == 'ride') {
        _completedRidesCount += 1;
      } else {
        _completedDeliveriesCount += 1;
      }
      _activeRiderJob = null;
    }
    notifyListeners();
  }

  void declineJob(String jobId) {
    _incomingRequests.removeWhere((r) => r.id == jobId);
    notifyListeners();
  }
}
