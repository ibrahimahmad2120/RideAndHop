import 'package:flutter/material.dart';
import 'models/models.dart';
import 'state/app_state.dart';
import 'screens/ridee_home_screen.dart';
import 'screens/rider_home_screen.dart';
import 'screens/activity_screen.dart';
import 'screens/earnings_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
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
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.white,
          elevation: 0,
          surfaceTintColor: Colors.transparent,
        ),
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
  late final AppStateManager _stateManager;

  @override
  void initState() {
    super.initState();
    _stateManager = AppStateManager();
  }

  @override
  void dispose() {
    _stateManager.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ListenableBuilder(
      listenable: _stateManager,
      builder: (context, _) {
        final isRidee = _stateManager.currentRole == UserRole.ridee;
        return PopScope(
          canPop: _stateManager.currentTabIndex == 0,
          onPopInvoked: (didPop) {
            if (!didPop && _stateManager.currentTabIndex != 0) {
              _stateManager.setTabIndex(0);
            }
          },
          child: Scaffold(
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
                    isRidee ? 'RideNHop Passenger' : 'RideNHop Partner',
                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: Color(0xFF17231B)),
                  ),
                ],
              ),
              actions: [
                TextButton.icon(
                  onPressed: () {
                    _stateManager.switchRole(isRidee ? UserRole.rider : UserRole.ridee);
                  },
                  icon: const Icon(Icons.swap_horiz, size: 16, color: Color(0xFF16A34A)),
                  label: Text(
                    isRidee ? 'Switch to Rider' : 'Switch to Ridee',
                    style: const TextStyle(color: Color(0xFF16A34A), fontWeight: FontWeight.bold, fontSize: 12),
                  ),
                ),
              ],
            ),
            body: isRidee ? _buildRideeBody() : _buildRiderBody(),
            bottomNavigationBar: NavigationBar(
              selectedIndex: _stateManager.currentTabIndex,
              onDestinationSelected: (idx) => _stateManager.setTabIndex(idx),
              backgroundColor: Colors.white,
              indicatorColor: const Color(0xFFDCFCE7),
              destinations: isRidee
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
          ),
        );
      },
    );
  }

  Widget _buildRideeBody() {
    switch (_stateManager.currentTabIndex) {
      case 0:
        return RideeHomeScreen(stateManager: _stateManager);
      case 1:
        return ActivityScreen(stateManager: _stateManager);
      case 2:
        return _buildOffersList();
      case 3:
      default:
        return _buildProfileView('Alex Morgan', 'RideNHop Passenger VIP · Manchester M1');
    }
  }

  Widget _buildRiderBody() {
    switch (_stateManager.currentTabIndex) {
      case 0:
        return RiderHomeScreen(stateManager: _stateManager);
      case 1:
        return RiderHomeScreen(stateManager: _stateManager);
      case 2:
        return EarningsScreen(stateManager: _stateManager);
      case 3:
      default:
        return _buildProfileView('Jordan Lee', '5-Star Pro Rider · Yamaha MT-07 (MT23 RDE)');
    }
  }

  Widget _buildOffersList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildOfferCard('RIDENHOP50', '50% Off First 2 Bike Rides', 'Valid for standard and express bookings in Greater Manchester'),
        _buildOfferCard('TWOWHEELS', '£2.50 Flat Credit on Any Ride', 'Auto-applied on checkout with RideNHop Wallet'),
        _buildOfferCard('GREENCOMMUTE', 'Free Helmet Shield & Top-Box', 'Complimentary sanitised liner & luggage storage'),
      ],
    );
  }

  Widget _buildOfferCard(String code, String title, String sub) {
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
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(code, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: Color(0xFF16A34A))),
                ),
              ],
            ),
            const SizedBox(height: 6),
            Text(sub, style: const TextStyle(fontSize: 12, color: Colors.grey)),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileView(String name, String badge) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Card(
          elevation: 0,
          color: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(24),
            side: const BorderSide(color: Color(0xFFE3EAE3)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Row(
              children: [
                const CircleAvatar(
                  radius: 28,
                  backgroundColor: Color(0xFFDCFCE7),
                  child: Icon(Icons.person, size: 32, color: Color(0xFF16A34A)),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                      const SizedBox(height: 4),
                      Text(badge, style: const TextStyle(fontSize: 12, color: Colors.grey)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
