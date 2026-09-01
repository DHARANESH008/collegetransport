class UserModel {
  final int id;
  final String username;
  final String email;
  final String name;
  final String mobileNumber;
  final String role;
  final String simpleRole;
  final String token;

  final int? assignedGateId;
  final String? assignedGateName;
  final int? assignedBusId;
  final int? assignedBusNumber;
  final String? assignedRegistrationNumber;
  final String? assignedRouteName;

  UserModel({
    required this.id,
    required this.username,
    required this.email,
    required this.name,
    required this.mobileNumber,
    required this.role,
    required this.simpleRole,
    required this.token,
    this.assignedGateId,
    this.assignedGateName,
    this.assignedBusId,
    this.assignedBusNumber,
    this.assignedRegistrationNumber,
    this.assignedRouteName,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      mobileNumber: json['mobileNumber'] ?? '',
      role: json['role'] ?? '',
      simpleRole: json['simpleRole'] ?? '',
      token: json['token'] ?? '',
      assignedGateId: json['assignedGateId'],
      assignedGateName: json['assignedGateName'],
      assignedBusId: json['assignedBusId'],
      assignedBusNumber: json['assignedBusNumber'],
      assignedRegistrationNumber: json['assignedRegistrationNumber'],
      assignedRouteName: json['assignedRouteName'],
    );
  }
}
