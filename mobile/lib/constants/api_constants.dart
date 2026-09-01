class ApiConstants {
  // Use 10.0.2.2 for Android Emulator, localhost for iOS or Web, or your PC IP for Physical Devices
  static const String baseUrl = 'http://10.0.2.2:8080/api';

  // Auth endpoints
  static const String login = '$baseUrl/auth/login';
  static const String validateReferenceId = '$baseUrl/auth/validate-reference-id';
  static const String registerAdmin = '$baseUrl/auth/register-admin';

  // Driver endpoints
  static const String driverBusInfo = '$baseUrl/driver/bus-info';
  static const String startJourney = '$baseUrl/driver/start-journey';
  static const String saveStudents = '$baseUrl/driver/save-students';
  static const String endJourney = '$baseUrl/driver/end-journey';
  static const String tripHistory = '$baseUrl/driver/trip-history';

  // Security endpoints
  static const String securityGateInfo = '$baseUrl/security/gate-info';
  static const String securityBusEntry = '$baseUrl/security/bus-entry';
  static const String securityTodayEntries = '$baseUrl/security/today-entries';

  // Admin endpoints
  static const String adminDashboardStats = '$baseUrl/admin/dashboard-stats';
  static const String adminSearchBus = '$baseUrl/admin/buses/search';
  static const String adminBuses = '$baseUrl/admin/buses';
  static const String adminDrivers = '$baseUrl/admin/drivers';
  static const String adminSecurity = '$baseUrl/admin/security';
  static const String adminRoutes = '$baseUrl/admin/routes';
  static const String adminGates = '$baseUrl/admin/gates';
  static const String adminReports = '$baseUrl/reports/query';
}
