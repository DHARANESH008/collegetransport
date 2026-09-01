import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/auth_provider.dart';
import '../../providers/language_provider.dart';
import '../../constants/app_colors.dart';
import '../driver/driver_home_screen.dart';
import '../security/security_home_screen.dart';
import '../admin/admin_home_screen.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _usernameController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;

  void _handleLogin() async {
    final auth = Provider.of<AuthProvider>(context, listen: false);
    final success = await auth.login(
      _usernameController.text.trim(),
      _passwordController.text.trim(),
    );

    if (success && mounted) {
      final role = auth.user?.role;
      if (role == 'ROLE_ADMIN') {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const AdminHomeScreen()));
      } else if (role == 'ROLE_DRIVER') {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const DriverHomeScreen()));
      } else if (role == 'ROLE_SECURITY') {
        Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => const SecurityHomeScreen()));
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final lang = Provider.of<LanguageProvider>(context);
    final auth = Provider.of<AuthProvider>(context);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Top Language Switcher Bar
                Align(
                  alignment: Alignment.topRight,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(color: Colors.white10),
                    ),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: lang.currentLanguage,
                        dropdownColor: AppColors.surface,
                        style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13),
                        items: const [
                          DropdownMenuItem(value: 'en', child: Text('🇬🇧 English')),
                          DropdownMenuItem(value: 'ta', child: Text('🇮🇳 தமிழ்')),
                        ],
                        onChanged: (val) {
                          if (val != null) lang.setLanguage(val);
                        },
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // College Icon & Title
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [AppColors.primary, AppColors.primaryDark],
                    ),
                    borderRadius: BorderRadius.circular(20),
                    boxShadow: [
                      BoxKey.create(color: AppColors.primary.withOpacity(0.4), blurRadius: 20),
                    ],
                  ),
                  child: const Icon(Icons.directions_bus, size: 40, color: Colors.white),
                ),

                const SizedBox(height: 16),
                Text(
                  lang.t('college_name'),
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    color: AppColors.textPrimary,
                    fontSize: 20,
                    fontWeight: FontWeight.w900,
                    letterSpacing: -0.5,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  lang.t('login_subtitle'),
                  style: const TextStyle(
                    color: AppColors.primary,
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                  ),
                ),

                const SizedBox(height: 32),

                // Glassmorphic Login Card
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface.withOpacity(0.85),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white12),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 30,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      if (auth.errorMessage != null)
                        Container(
                          padding: const EdgeInsets.all(12),
                          margin: const EdgeInsets.only(bottom: 16),
                          decoration: BoxDecoration(
                            color: AppColors.error.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: AppColors.error),
                          ),
                          child: Text(
                            auth.errorMessage!,
                            style: const TextStyle(color: AppColors.error, fontSize: 13),
                          ),
                        ),

                      // Username Field
                      TextField(
                        controller: _usernameController,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: lang.t('username'),
                          hintText: 'Enter username or email',
                          labelStyle: const TextStyle(color: AppColors.textSecondary),
                          prefixIcon: const Icon(Icons.person, color: AppColors.textSecondary),
                          filled: true,
                          fillColor: AppColors.background.withOpacity(0.5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),

                      const SizedBox(height: 16),

                      // Password Field
                      TextField(
                        controller: _passwordController,
                        obscureText: _obscurePassword,
                        style: const TextStyle(color: Colors.white),
                        decoration: InputDecoration(
                          labelText: lang.t('password'),
                          hintText: 'Enter password',
                          labelStyle: const TextStyle(color: AppColors.textSecondary),
                          prefixIcon: const Icon(Icons.lock, color: AppColors.textSecondary),
                          suffixIcon: IconButton(
                            icon: Icon(_obscurePassword ? Icons.visibility : Icons.visibility_off, color: AppColors.textSecondary),
                            onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
                          ),
                          filled: true,
                          fillColor: AppColors.background.withOpacity(0.5),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                        ),
                      ),

                      const SizedBox(height: 24),

                      // Submit Button
                      ElevatedButton(
                        onPressed: auth.loading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppColors.primary,
                          padding: const EdgeInsets.symmetric(vertical: 16),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                          elevation: 8,
                        ),
                        child: auth.loading
                            ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                            : Text(
                                lang.t('sign_in'),
                                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white),
                              ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class BoxKey {
  static BoxShadow create({required Color color, required double blurRadius}) {
    return BoxShadow(color: color, blurRadius: blurRadius);
  }
}
