import 'package:flutter/material.dart';
import '../state/app_state.dart';

class EarningsScreen extends StatelessWidget {
  final AppStateManager stateManager;

  const EarningsScreen({super.key, required this.stateManager});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          color: const Color(0xFF14532D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Available Balance', style: TextStyle(color: Colors.white70, fontSize: 13)),
                const SizedBox(height: 6),
                Text(
                  '£${stateManager.riderBalance.toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 34, fontWeight: FontWeight.bold, color: Colors.white),
                ),
                const SizedBox(height: 14),
                ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF14532D),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    stateManager.requestPayout(50.0);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Instant Payout of £50.00 dispatched via Faster Payments!'),
                        backgroundColor: Color(0xFF16A34A),
                      ),
                    );
                  },
                  icon: const Icon(Icons.flash_on, size: 16),
                  label: const Text('Instant Cash Out (£50.00)', style: TextStyle(fontWeight: FontWeight.bold)),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 20),
        const Text('Earnings Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF17231B))),
        const SizedBox(height: 10),
        _buildStatTile(Icons.two_wheeler, 'Completed Motorcycle Rides', '${stateManager.completedRidesCount} trips', '£52.40'),
        _buildStatTile(Icons.inventory_2_outlined, 'Parcel Deliveries', '${stateManager.completedDeliveriesCount} parcels', '£16.00'),
        _buildStatTile(Icons.card_giftcard, 'Passenger Tips', '100% kept by driver', '£12.50'),
      ],
    );
  }

  Widget _buildStatTile(IconData icon, String title, String sub, String amount) {
    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 8),
      color: Colors.white,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFE3EAE3)),
      ),
      child: ListTile(
        leading: CircleAvatar(
          radius: 16,
          backgroundColor: const Color(0xFFF7FAF7),
          child: Icon(icon, size: 18, color: const Color(0xFF16A34A)),
        ),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
        subtitle: Text(sub, style: const TextStyle(fontSize: 11, color: Colors.grey)),
        trailing: Text(amount, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
      ),
    );
  }
}
