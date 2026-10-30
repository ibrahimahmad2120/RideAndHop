import 'package:flutter/material.dart';
import '../models/models.dart';
import '../state/app_state.dart';

class RiderHomeScreen extends StatelessWidget {
  final AppStateManager stateManager;

  const RiderHomeScreen({super.key, required this.stateManager});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20),
            side: const BorderSide(color: Color(0xFFE3EAE3)),
          ),
          child: SwitchListTile(
            title: Text(
              stateManager.isRiderOnline ? 'You are Online' : 'You are Offline',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
            ),
            subtitle: Text(
              stateManager.isRiderOnline ? 'Accepting bike rides & parcel deliveries' : 'Tap switch to go online',
              style: const TextStyle(fontSize: 12),
            ),
            value: stateManager.isRiderOnline,
            activeColor: const Color(0xFF16A34A),
            onChanged: (val) => stateManager.toggleRiderOnline(val),
          ),
        ),
        const SizedBox(height: 14),
        Card(
          color: const Color(0xFF14532D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Today's Earnings", style: TextStyle(color: Colors.white70, fontSize: 13)),
                const SizedBox(height: 6),
                Text(
                  '£${stateManager.riderEarningsToday.toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 8),
                Text(
                  '${stateManager.completedRidesCount} Rides · ${stateManager.completedDeliveriesCount} Deliveries · 4.94 ★ Rating',
                  style: const TextStyle(color: Colors.white70, fontSize: 12),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 18),
        const Text(
          'Live Incoming Requests',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: Color(0xFF17231B)),
        ),
        const SizedBox(height: 10),
        if (stateManager.incomingRequests.isEmpty)
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE3EAE3)),
            ),
            child: const Center(
              child: Text(
                'No pending requests. Cruising in Manchester...',
                style: TextStyle(color: Colors.grey, fontSize: 13),
              ),
            ),
          )
        else
          ...stateManager.incomingRequests.map((job) => _buildJobCard(job)),
      ],
    );
  }

  Widget _buildJobCard(IncomingJob job) {
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
                    CircleAvatar(
                      radius: 14,
                      backgroundColor: job.type == 'ride' ? const Color(0xFFDCFCE7) : const Color(0xFFFEF3C7),
                      child: Icon(
                        job.type == 'ride' ? Icons.two_wheeler : Icons.inventory_2,
                        size: 16,
                        color: job.type == 'ride' ? const Color(0xFF16A34A) : const Color(0xFFD97706),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Text(
                      job.customerName,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
                    ),
                  ],
                ),
                Text(
                  '£${job.earnings.toStringAsFixed(2)}',
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF16A34A)),
                ),
              ],
            ),
            const SizedBox(height: 10),
            Text('From: ${job.pickupName}', style: const TextStyle(fontSize: 12, color: Color(0xFF68746B))),
            Text('To: ${job.destinationName}', style: const TextStyle(fontSize: 12, color: Color(0xFF17231B), fontWeight: FontWeight.w500)),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF16A34A),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    onPressed: () => stateManager.acceptJob(job),
                    child: const Text('Accept Job'),
                  ),
                ),
                const SizedBox(width: 8),
                OutlinedButton(
                  style: OutlinedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: () => stateManager.declineJob(job.id),
                  child: const Text('Decline'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
