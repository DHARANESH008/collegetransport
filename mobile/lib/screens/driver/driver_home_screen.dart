import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../constants/app_colors.dart';
import '../../services/api_service.dart';
import '../../constants/api_constants.dart';
import '../auth/login_screen.dart';

class DriverHomeScreen extends StatefulWidget {
  const DriverHomeScreen({super.key});

  @override
  State<DriverHomeScreen> createState() => _DriverHomeScreenState();
}

class _DriverHomeScreenState extends State<DriverHomeScreen> {
  Map<String, dynamic>? _busInfo;
  bool _loading = true;
  final _studentCountController = TextEditingController();
  final _endKmController = TextEditingController();
  final _manualStartKmController = TextEditingController();

  @override
  void initState() {
    super.initState();
    _fetchBusInfo();
  }

  Future<void> _fetchBusInfo() async {
    setState(() => _loading = true);
    try {
      final res = await ApiService.get(ApiConstants.driverBusInfo);
      if (res['success'] == true) {
        setState(() {
          _busInfo = res['data'];
          if (_busInfo?['studentCount'] != null && _busInfo!['studentCount'] > 0) {
            _studentCountController.text = _busInfo!['studentCount'].toString();
          }
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

  Future<void> _startJourney() async {
    try {
      final isAuto = _busInfo?['isAutoStartKm'] == true;
      final manualKm = isAuto ? null : double.tryParse(_manualStartKmController.text);
      await ApiService.post(ApiConstants.startJourney, {
        if (manualKm != null) 'manualStartKm': manualKm,
      });
      _fetchBusInfo();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  Future<void> _saveStudents() async {
    final count = int.tryParse(_studentCountController.text);
    if (count == null) return;
    try {
      await ApiService.post(ApiConstants.saveStudents, {'studentCount': count});
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Student count saved')));
      _fetchBusInfo();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  Future<void> _endJourney() async {
    final endKm = double.tryParse(_endKmController.text);
    if (endKm == null) return;
    try {
      final res = await ApiService.post(ApiConstants.endJourney, {'endKm': endKm});
      final dist = res['data']?['totalDistance'];
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Trip Completed! Distance: $dist KM')));
      _fetchBusInfo();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);
    final auth = Provider.of<AuthProvider>(context);
    final status = _busInfo?['journeyStatus'] ?? 'NOT_STARTED';

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        backgroundColor: AppColors.surface,
        title: Text(lang.t('driver_console'), style: const TextStyle(fontWeight: FontWeight.bold)),
        actions: [
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
                  // Assigned Bus Header
                  Card(
                    color: AppColors.surface,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    child: Padding(
                      padding: const EdgeInsets.all(20),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                '${lang.t('assigned_bus')}: #${_busInfo?['busNumber'] ?? '-'}',
                                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w900, color: Colors.white),
                              ),
                              Chip(
                                label: Text(status, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 11)),
                                backgroundColor: status == 'COMPLETED' ? AppColors.secondary : AppColors.primary,
                              )
                            ],
                          ),
                          const SizedBox(height: 8),
                          Text(
                            '${lang.t('route')}: ${_busInfo?['routeName'] ?? '-'} (${_busInfo?['registrationNumber'] ?? ''})',
                            style: const TextStyle(color: AppColors.textSecondary, fontWeight: FontWeight.w600),
                          ),
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // STEP 1: START JOURNEY
                  Card(
                    color: AppColors.surface,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text('1. ${lang.t('start_journey')}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16)),
                          const SizedBox(height: 8),
                          Text(
                            'Start KM: ${_busInfo?['startKm'] ?? 'First Day - Enter Below'}',
                            style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.bold, fontSize: 18),
                          ),
                          if (_busInfo?['isAutoStartKm'] == false && status == 'NOT_STARTED') ...[
                            const SizedBox(height: 8),
                            TextField(
                              controller: _manualStartKmController,
                              keyboardType: TextInputType.number,
                              style: const TextStyle(color: Colors.white),
                              decoration: const InputDecoration(labelText: 'Initial Start KM', filled: true),
                            ),
                          ],
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: status == 'NOT_STARTED' ? _startJourney : null,
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
                            child: Text(lang.t('start_journey')),
                          )
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // STEP 2: SAVE STUDENTS
                  Card(
                    color: AppColors.surface,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text('2. ${lang.t('save_students')}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16)),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _studentCountController,
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(labelText: lang.t('students'), filled: true),
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: (status == 'IN_TRANSIT' || status == 'COLLEGE_ARRIVED') ? _saveStudents : null,
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.warning),
                            child: Text(lang.t('save_students')),
                          )
                        ],
                      ),
                    ),
                  ),

                  const SizedBox(height: 16),

                  // STEP 3: END JOURNEY
                  Card(
                    color: AppColors.surface,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Text('3. ${lang.t('end_journey')}', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16)),
                          const SizedBox(height: 12),
                          TextField(
                            controller: _endKmController,
                            keyboardType: TextInputType.number,
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(labelText: lang.t('end_km'), filled: true),
                          ),
                          const SizedBox(height: 12),
                          ElevatedButton(
                            onPressed: (status == 'COLLEGE_ARRIVED' || status == 'IN_TRANSIT') ? _endJourney : null,
                            style: ElevatedButton.styleFrom(backgroundColor: AppColors.secondary),
                            child: Text(lang.t('end_journey')),
                          )
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
    );
  }
}
