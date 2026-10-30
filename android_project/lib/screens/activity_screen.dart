import 'package:flutter/material.dart';
import '../models/models.dart';
import '../state/app_state.dart';

class ActivityScreen extends StatelessWidget {
  final AppStateManager stateManager;

  const ActivityScreen({super.key, required this.stateManager});

  @override
  Widget build(BuildContext context) {
    final rides = stateManager.pastRides;
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: rides.length,
      itemBuilder: (context, index) {
        final ride = rides[index];
        return Card(
          elevation: 0,
          margin: const EdgeInsets.only(bottom: 12),
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
                Row(
                  mainAxisAlignment: MainAxisAlignment.between,
                  children: [
                    Row(
                      children: [
                        const CircleAvatar(
                          radius: 16,
                          backgroundColor: Color(0xFFDCFCE7),
                          child: Icon(Icons.two_wheeler, size: 18, color: Color(0xFF16A34A)),
                        ),
                        const SizedBox(width: 10),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(ride.rideOption.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                            Text('${ride.createdAt} · Ref: ${ride.reference}', style: const TextStyle(fontSize: 11, color: Colors.grey)),
                          ],
                        ),
                      ],
                    ),
                    Text(
                      '£${(ride.fare + ride.tip).toStringAsFixed(2)}',
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF17231B)),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.only(left: 8),
                  decoration: const BoxDecoration(
                    border: Border(left: BorderSide(color: Color(0xFF16A34A), width: 2)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(ride.pickup.name, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500)),
                      const SizedBox(height: 2),
                      Text(ride.destination.name, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
                const SizedBox(height: 12),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.star, color: Colors.amber, size: 16),
                        const SizedBox(width: 4),
                        Text('${ride.rating}.0', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)),
                        Text(' · ${ride.rider.name}', style: const TextStyle(color: Colors.grey, fontSize: 12)),
                      ],
                    ),
                    TextButton(
                      onPressed: () {
                        stateManager.startRideBooking(ride.rideOption, ride.pickup, ride.destination);
                        stateManager.setTabIndex(0);
                      },
                      child: const Text('Re-book Bike', style: TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 12)),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
