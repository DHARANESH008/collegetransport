import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../constants/app_colors.dart';
import '../../services/api_service.dart';
import '../../constants/api_constants.dart';
import '../auth/login_screen.dart';

class AdminHomeScreen extends StatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  State<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends State<AdminHomeScreen> {
  Map<String, dynamic>? _stats;
  bool _loading = true;
  final _busSearchController = TextEditingController(text: '25');
  Map<String, dynamic>? _searchedBus;

  @override
  void initState() {
    super.initState();
    _fetchStats();
  }

  Future<void> _fetchStats() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.get(ApiConstants.adminDashboardStats);
      if (mounted) {
        setState(() {
          _stats = res['data'];
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  Future<void> _searchBus() async {
    final num = int.tryParse(_busSearchController.text);
    if (num == null) return;
    try {
      final res = await ApiService.get('${ApiConstants.adminSearchBus}/$num');
      setState(() => _searchedBus = res['data']);
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(lang.t('dashboard'), style: const TextStyle(fontWeight: FontWeight.bold)),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchStats,
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: AppColors.error),
            onPressed: () {
              auth.logout();
              Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const LoginScreen()));
            },
          )
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  // KPI Grid
                  GridView.count(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      _buildKpiCard('Total Buses', '${_stats?['totalBuses'] ?? 0}', Icons.directions_bus, AppColors.primary),
                      _buildKpiCard('Total Drivers', '${_stats?['totalDrivers'] ?? 0}', Icons.person, AppColors.secondary),
                      _buildKpiCard('Today Students', '${_stats?['todayStudentCount'] ?? 0}', Icons.school, AppColors.warning),
                      _buildKpiCard('Today Distance', '${_stats?['todayDistance'] ?? 0} KM', Icons.speed, AppColors.info),
                    ],
                  ),

                  const SizedBox(height: 24),

                  // Real-Time Bus 0-150 Search Card
                  Card(
                    color: AppColors.surface,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Text(
                            'Bus Inspector (0-150)',
                            style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: Colors.white),
                          ),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: TextField(
                                  controller: _busSearchController,
                                  keyboardType: TextInputType.number,
                                  style: const TextStyle(color: Colors.white),
                                  decoration: InputDecoration(
                                    labelText: 'Bus Number (0-150)',
                                    filled: true,
                                    fillColor: AppColors.background,
                                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              ElevatedButton(
                                onPressed: _searchBus,
                                style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                                child: const Text('Inspect'),
                              )
                            ],
                          ),

                          if (_searchedBus != null) ...[
                            const SizedBox(height: 16),
                            const Divider(color: Colors.white12),
                            const SizedBox(height: 8),
                            Text(
                              'Bus #${_searchedBus!['busNumber']} (${_searchedBus!['registrationNumber']})',
                              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primary),
                            ),
                            const SizedBox(height: 6),
                            Text('Route: ${_searchedBus!['route']}', style: const TextStyle(color: Colors.white70)),
                            Text('Driver: ${_searchedBus!['driverName']} (${_searchedBus!['driverMobile']})', style: const TextStyle(color: Colors.white70)),
                            Text('Gate Entry Time: ${_searchedBus!['securityGateEntryTime']}', style: const TextStyle(color: Colors.white70)),
                            Text('Distance: ${_searchedBus!['totalDistance'] ?? 0} KM • Students: ${_searchedBus!['studentCount'] ?? 0}', style: const TextStyle(color: AppColors.secondary, fontWeight: FontWeight.bold)),
                          ]
                        ],
                      ),
                    ),
                  )
                ],
              ),
            ),
    );
  }

  Widget _buildKpiCard(String title, String value, IconData icon, Color color) {
    return Card(
      color: AppColors.surface,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Icon(icon, color: color, size: 28),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: const TextStyle(color: AppColors.textSecondary, fontSize: 11, fontWeight: FontWeight.bold)),
                const SizedBox(height: 4),
                Text(value, style: const TextStyle(color: Colors.white, fontSize: 20, fontWeight: FontWeight.w900)),
              ],
            )
          ],
        ),
      ),
    );
  }
}
