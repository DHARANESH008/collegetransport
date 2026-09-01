import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'providers/language_provider.dart';
import 'constants/app_colors.dart';
import 'screens/auth/login_screen.dart';
import 'screens/driver/driver_home_screen.dart';
import 'screens/security/security_home_screen.dart';
import 'screens/admin/admin_home_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LanguageProvider()),
        ChangeNotifierProvider(create: (_) => AuthProvider()),
      ],
      child: const SmartTransportApp(),
    ),
  );
}

class SmartTransportApp extends StatelessWidget {
  const SmartTransportApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Smart College Transport',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: AppColors.background,
        primaryColor: AppColors.primary,
        colorScheme: const ColorScheme.dark(
          primary: AppColors.primary,
          secondary: AppColors.secondary,
          surface: AppColors.surface,
          error: AppColors.error,
        ),
        useMaterial3: true,
      ),
      home: const AuthWrapper(),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({super.key});

  @override
  Widget build(BuildContext context) {
    final auth = Provider.of<AuthProvider>(context);

    if (!auth.isAuthenticated) {
      return const LoginScreen();
    }

    final role = auth.user?.role;
    if (role == 'ROLE_ADMIN') {
      return const AdminHomeScreen();
    } else if (role == 'ROLE_DRIVER') {
      return const DriverHomeScreen();
    } else if (role == 'ROLE_SECURITY') {
      return const SecurityHomeScreen();
    }

    return const LoginScreen();
  }
}
