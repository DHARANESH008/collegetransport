import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../constants/app_colors.dart';
import '../../services/api_service.dart';
import '../../constants/api_constants.dart';
import '../auth/login_screen.dart';

class SecurityHomeScreen extends StatefulWidget {
  const SecurityHomeScreen({super.key});

  @override
  State<SecurityHomeScreen> createState() => _SecurityHomeScreenState();
}

class _SecurityHomeScreenState extends State<SecurityHomeScreen> {
  Map<String, dynamic>? _gateInfo;
  List<dynamic> _entries = [];
  bool _loading = true;
  int _selectedBus = 25;

  @override
  void initState() {
    super.initState();
    _fetchGateData();
  }

  Future<void> _fetchGateData() async {
    setState(() => _loading = true);
    try {
      final gateRes = await ApiService.get(ApiConstants.securityGateInfo);
      final entriesRes = await ApiService.get(ApiConstants.securityTodayEntries);

      if (mounted) {
        setState(() {
          _gateInfo = gateRes['data'];
          _entries = entriesRes['data'] ?? [];
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

  Future<void> _recordBusEntry() async {
    try {
      final res = await ApiService.post(ApiConstants.securityBusEntry, {'busNumber': _selectedBus});
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text('✅ Bus #$_selectedBus Entry Logged at ${_gateInfo?['gateName']}'),
        backgroundColor: AppColors.secondary,
      ));
      _fetchGateData();
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(
        content: Text(e.toString().replaceAll('Exception: ', '')),
        backgroundColor: AppColors.error,
      ));
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
        title: Text(lang.t('security_gate'), style: const TextStyle(fontWeight: FontWeight.bold)),
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
          : RefreshIndicator(
              onRefresh: _fetchGateData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // Assigned Gate Name Banner (Security name is hidden as required)
                    Card(
                      color: AppColors.surface,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(20),
                        side: const BorderSide(color: AppColors.warning, width: 1.5),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          children: [
                            const Text(
                              'ASSIGNED CHECKPOINT GATE',
                              style: TextStyle(color: AppColors.warning, fontWeight: FontWeight.bold, fontSize: 11, letterSpacing: 1),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              _gateInfo?['gateName'] ?? 'Main Gate',
                              style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w900, color: Colors.white),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              'Terminal ID Active • Staff Name Hidden',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 12),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 20),

                    // Bus Number Selection (0 to 150) with Search Box & Scrollable Selector
                    Card(
                      color: AppColors.surface,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      child: Padding(
                        padding: const EdgeInsets.all(20),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.stretch,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(lang.t('select_bus'), style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 16)),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                                  decoration: BoxDecoration(
                                    color: AppColors.warning.withOpacity(0.15),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: Text('Selected: Bus #$_selectedBus', style: const TextStyle(color: AppColors.warning, fontWeight: FontWeight.w900)),
                                ),
                              ],
                            ),
                            const SizedBox(height: 14),

                            // Search / Custom Bus Number Input
                            TextField(
                              keyboardType: TextInputType.number,
                              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 16),
                              decoration: InputDecoration(
                                hintText: 'Type Bus Number (0 - 150)...',
                                hintStyle: const TextStyle(color: AppColors.textSecondary, fontSize: 14),
                                prefixIcon: const Icon(Icons.search, color: AppColors.warning),
                                filled: true,
                                fillColor: AppColors.background,
                                border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                              ),
                              onChanged: (val) {
                                final n = int.tryParse(val.trim());
                                if (n != null && n >= 0 && n <= 150) {
                                  setState(() => _selectedBus = n);
                                }
                              },
                            ),
                            const SizedBox(height: 14),

                            const Text(
                              'Quick Select / Scroll to Touch Bus:',
                              style: TextStyle(color: AppColors.textSecondary, fontSize: 12, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 8),

                            // Horizontal Scrollable Bus Badges
                            SingleChildScrollView(
                              scrollDirection: Axis.horizontal,
                              child: Row(
                                children: [0, 7, 12, 18, 25, 42, 55, 88, 105, 120, 150].map((num) {
                                  final isSel = _selectedBus == num;
                                  return Padding(
                                    padding: const EdgeInsets.only(right: 8),
                                    child: ChoiceChip(
                                      label: Text('Bus #$num', style: TextStyle(fontWeight: FontWeight.w900, color: isSel ? Colors.black : Colors.white)),
                                      selected: isSel,
                                      selectedColor: AppColors.warning,
                                      backgroundColor: AppColors.background,
                                      onSelected: (selected) {
                                        if (selected) setState(() => _selectedBus = num);
                                      },
                                    ),
                                  );
                                }).toList(),
                              ),
                            ),

                            const SizedBox(height: 20),

                            // Large "BUS ENTER" Button
                            ElevatedButton(
                              onPressed: _recordBusEntry,
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.warning,
                                padding: const EdgeInsets.symmetric(vertical: 18),
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                                elevation: 8,
                              ),
                              child: Text(
                                '${lang.t('bus_enter')} #$_selectedBus',
                                style: const TextStyle(fontSize: 19, fontWeight: FontWeight.w900, color: Colors.black),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                    const SizedBox(height: 24),

                    // Today's Gate Entries List
                    Text(
                      '${lang.t('today_entries')} (${_entries.length})',
                      style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white),
                    ),
                    const SizedBox(height: 12),

                    if (_entries.isEmpty)
                      const Center(
                        child: Padding(
                          padding: EdgeInsets.all(24),
                          child: Text('No bus entries recorded at this gate today yet.', style: TextStyle(color: AppColors.textSecondary)),
                        ),
                      )
                    else
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: _entries.length,
                        itemBuilder: (context, idx) {
                          final item = _entries[idx];
                          return Card(
                            color: AppColors.surface,
                            margin: const EdgeInsets.only(bottom: 10),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            child: ListTile(
                              leading: CircleAvatar(
                                backgroundColor: AppColors.warning.withOpacity(0.2),
                                child: Text('#${item['busNumber']}', style: const TextStyle(color: AppColors.warning, fontWeight: FontWeight.bold)),
                              ),
                              title: Text('${item['registrationNumber'] ?? 'Bus'} (${item['routeName'] ?? ''})', style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
                              subtitle: Text('Entry Time: ${item['entryTime']}', style: const TextStyle(color: AppColors.textSecondary)),
                              trailing: Text(item['gateName'] ?? '', style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w600)),
                            ),
                          );
                        },
                      )
                  ],
                ),
              ),
            ),
    );
  }
}
