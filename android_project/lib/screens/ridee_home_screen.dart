import 'package:flutter/material.dart';
import '../models/models.dart';
import '../state/app_state.dart';
import '../widgets/stylized_map.dart';

class RideeHomeScreen extends StatelessWidget {
  final AppStateManager stateManager;

  const RideeHomeScreen({super.key, required this.stateManager});

  @override
  Widget build(BuildContext context) {
    if (stateManager.rideStage != RideStage.idle && stateManager.activeRide != null) {
      return _buildActiveRideTracking(context);
    }

    return ListView(
      padding: EdgeInsets.zero,
      children: [
        const StylizedMapWidget(height: 220),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Card(
                elevation: 0,
                color: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                  side: const BorderSide(color: Color(0xFFE3EAE3)),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Where to, Alex?',
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF17231B)),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF7FAF7),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: const Color(0xFFE3EAE3)),
                        ),
                        child: const Row(
                          children: [
                            Icon(Icons.search, color: Color(0xFF16A34A), size: 20),
                            SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                'Search destination in Manchester...',
                                style: TextStyle(color: Color(0xFF68746B), fontSize: 13),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Instant Two-Wheeled Mobility',
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Color(0xFF17231B)),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _buildServiceTile(
                      icon: Icons.two_wheeler,
                      title: 'Book a Bike',
                      subtitle: 'From £4.80 · 2 min',
                      color: const Color(0xFF16A34A),
                      onTap: () {
                        stateManager.startRideBooking(
                          AppStateManager.mockRideOptions[0],
                          AppStateManager.mockLocations[0],
                          AppStateManager.mockLocations[1],
                        );
                      },
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _buildServiceTile(
                      icon: Icons.inventory_2_outlined,
                      title: 'Send Parcel',
                      subtitle: 'From £5.80 · Express',
                      color: const Color(0xFFD97706),
                      onTap: () {},
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Card(
                color: const Color(0xFF14532D),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                child: const Padding(
                  padding: EdgeInsets.all(16),
                  child: Row(
                    children: [
                      Icon(Icons.local_offer, color: Colors.amberAccent, size: 28),
                      SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('50% Off First 2 Bike Rides', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 14)),
                            SizedBox(height: 2),
                            Text('Use code RIDENHOP50 at checkout', style: TextStyle(color: Colors.white70, fontSize: 12)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildActiveRideTracking(BuildContext context) {
    final ride = stateManager.activeRide!;
    return Column(
      children: [
        StylizedMapWidget(
          pickup: ride.pickup,
          destination: ride.destination,
          height: 260,
        ),
        Expanded(
          child: Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          stateManager.rideStage == RideStage.searching
                              ? 'Matching with nearby rider...'
                              : stateManager.rideStage == RideStage.completed
                              ? 'Ride Completed!'
                              : 'Jordan Lee is on the way',
                          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        Text(
                          'Yamaha MT-07 · MT23 RDE',
                          style: TextStyle(color: Colors.grey[600], fontSize: 12),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF16A34A).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        '£${ride.fare.toStringAsFixed(2)}',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF16A34A)),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                const Divider(),
                const SizedBox(height: 12),
                Row(
                  children: [
                    Expanded(
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFF16A34A),
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                        onPressed: () => stateManager.advanceRideStage(),
                        child: Text(
                          stateManager.rideStage == RideStage.completed ? 'Done' : 'Advance Stage (Demo)',
                        ),
                      ),
                    ),
                    const SizedBox(width: 8),
                    TextButton(
                      onPressed: () => stateManager.cancelActiveRide(),
                      child: const Text('Cancel', style: TextStyle(color: Colors.red)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildServiceTile({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required VoidCallback onTap,
  }) {
    return Card(
      elevation: 0,
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: const BorderSide(color: Color(0xFFE3EAE3)),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(icon, color: color, size: 28),
              const SizedBox(height: 12),
              Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
              const SizedBox(height: 2),
              Text(subtitle, style: TextStyle(color: color, fontWeight: FontWeight.w600, fontSize: 12)),
            ],
          ),
        ),
      ),
    );
  }
}
