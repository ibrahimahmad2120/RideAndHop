import 'package:flutter/material.dart';

void main() {
  runApp(const RideNHopApp());
}

class RideNHopApp extends StatelessWidget {
  const RideNHopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'RideNHop',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF16A34A),
          primary: const Color(0xFF16A34A),
          surface: const Color(0xFFF7FAF7),
        ),
        scaffoldBackgroundColor: const Color(0xFFF7FAF7),
      ),
      home: const RideNHopMainScreen(),
    );
  }
}

class RideNHopMainScreen extends StatefulWidget {
  const RideNHopMainScreen({super.key});

  @override
  State<RideNHopMainScreen> createState() => _RideNHopMainScreenState();
}

class _RideNHopMainScreenState extends State<RideNHopMainScreen> {
  String _currentRole = 'ridee'; // 'ridee' or 'rider'
  int _currentIndex = 0;
  bool _isRiderOnline = true;
  double _walletBalance = 38.50;
  double _riderEarnings = 68.40;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF16A34A),
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Text('RH', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
            ),
            const SizedBox(width: 8),
            Text(
              _currentRole == 'ridee' ? 'RideNHop Passenger' : 'RideNHop Partner',
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
          ],
        ),
        actions: [
          TextButton.icon(
            onPressed: () {
              setState(() {
                _currentRole = _currentRole == 'ridee' ? 'rider' : 'ridee';
                _currentIndex = 0;
              });
            },
            icon: const Icon(Icons.swap_horiz, size: 16),
            label: Text(_currentRole == 'ridee' ? 'Switch Rider' : 'Switch Ridee'),
          ),
        ],
      ),
      body: _currentRole == 'ridee' ? _buildRideeView() : _buildRiderView(),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (idx) => setState(() => _currentIndex = idx),
        destinations: _currentRole == 'ridee'
            ? const [
                NavigationDestination(icon: Icon(Icons.two_wheeler), label: 'Rides'),
                NavigationDestination(icon: Icon(Icons.history), label: 'Activity'),
                NavigationDestination(icon: Icon(Icons.local_offer_outlined), label: 'Offers'),
                NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
              ]
            : const [
                NavigationDestination(icon: Icon(Icons.navigation_outlined), label: 'Drive'),
                NavigationDestination(icon: Icon(Icons.inbox_outlined), label: 'Requests'),
                NavigationDestination(icon: Icon(Icons.account_balance_wallet_outlined), label: 'Earnings'),
                NavigationDestination(icon: Icon(Icons.person_outline), label: 'Profile'),
              ],
      ),
    );
  }

  Widget _buildRideeView() {
    if (_currentIndex == 0) {
      return ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Card(
            elevation: 0,
            color: Colors.white,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('Where to, Alex?', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 12),
                  TextField(
                    decoration: InputDecoration(
                      prefixIcon: const Icon(Icons.search, color: Color(0xFF16A34A)),
                      hintText: 'Search destination in Manchester...',
                      filled: true,
                      fillColor: const Color(0xFFF7FAF7),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(
                child: _buildActionTile(
                  icon: Icons.two_wheeler,
                  title: 'Book a Bike',
                  subtitle: 'From £4.80',
                  color: const Color(0xFF16A34A),
                  onTap: () {},
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: _buildActionTile(
                  icon: Icons.inventory_2_outlined,
                  title: 'Send Parcel',
                  subtitle: 'From £5.80',
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
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('50% Off First 2 Rides', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                  SizedBox(height: 4),
                  Text('Use code RIDENHOP50 at checkout', style: TextStyle(color: Colors.white70, fontSize: 12)),
                ],
              ),
            ),
          ),
        ],
      );
    }
    return Center(child: Text('RideNHop Ridee Tab ${_currentIndex + 1}'));
  }

  Widget _buildRiderView() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SwitchListTile(
          title: Text(_isRiderOnline ? 'You are Online' : 'You are Offline', style: const TextStyle(fontWeight: FontWeight.bold)),
          subtitle: const Text('Deansgate Square · Accepting rides & parcels'),
          value: _isRiderOnline,
          activeColor: const Color(0xFF16A34A),
          onChanged: (val) => setState(() => _isRiderOnline = val),
        ),
        const SizedBox(height: 12),
        Card(
          color: const Color(0xFF14532D),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text("Today's Earnings", style: TextStyle(color: Colors.white70)),
                const SizedBox(height: 6),
                Text('£${_riderEarnings.toStringAsFixed(2)}', style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: Colors.white)),
                const SizedBox(height: 6),
                const Text('6 Rides · 4 Deliveries · 4h 25m online', style: TextStyle(color: Colors.white70, fontSize: 12)),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildActionTile({
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
