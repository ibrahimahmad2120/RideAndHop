import 'package:flutter/material.dart';
import '../models/models.dart';

class StylizedMapWidget extends StatelessWidget {
  final LocationItem? pickup;
  final LocationItem? destination;
  final double height;

  const StylizedMapWidget({
    super.key,
    this.pickup,
    this.destination,
    this.height = 240,
  });

  @override
  Widget build(BuildContext context) {
    return RepaintBoundary(
      child: Container(
        height: height,
        width: double.infinity,
        decoration: const BoxDecoration(
          color: Color(0xFFF3F7F3),
          border: Border(bottom: BorderSide(color: Color(0xFFE3EAE3))),
        ),
        child: CustomPaint(
          painter: _MapPainter(
            pickup: pickup,
            destination: destination,
          ),
          child: Stack(
            children: [
              Positioned(
                top: 12,
                left: 12,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.92),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE3EAE3)),
                    boxShadow: const [BoxShadow(color: Colors.black12, blurRadius: 4)],
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      CircleAvatar(radius: 3, backgroundColor: Color(0xFF16A34A)),
                      SizedBox(width: 6),
                      Text('Manchester Central', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold, color: Color(0xFF17231B))),
                    ],
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MapPainter extends CustomPainter {
  final LocationItem? pickup;
  final LocationItem? destination;

  const _MapPainter({this.pickup, this.destination});

  @override
  void paint(Canvas canvas, Size size) {
    final bgPaint = Paint()..color = const Color(0xFFF3F7F3);
    canvas.drawRect(Rect.fromLTWH(0, 0, size.width, size.height), bgPaint);

    // Parks
    final parkPaint = Paint()..color = const Color(0xFFE2EFE2);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width * 0.05, size.height * 0.1, size.width * 0.2, size.height * 0.25), const Radius.circular(6)), parkPaint);
    canvas.drawRRect(RRect.fromRectAndRadius(Rect.fromLTWH(size.width * 0.7, size.height * 0.65, size.width * 0.25, size.height * 0.25), const Radius.circular(6)), parkPaint);

    // River
    final riverPaint = Paint()
      ..color = const Color(0xFFD7E8F7)
      ..strokeWidth = 14
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;

    final riverPath = Path()
      ..moveTo(0, size.height * 0.3)
      ..quadraticBezierTo(size.width * 0.35, size.height * 0.3, size.width * 0.55, size.height * 0.6)
      ..quadraticBezierTo(size.width * 0.75, size.height * 0.9, size.width, size.height * 0.95);
    canvas.drawPath(riverPath, riverPaint);

    // Major Arterials (Roads)
    final roadPaint = Paint()
      ..color = Colors.white
      ..strokeWidth = 12
      ..style = PaintingStyle.stroke;

    final roadBorderPaint = Paint()
      ..color = const Color(0xFFE2E8E0)
      ..strokeWidth = 1.2
      ..style = PaintingStyle.stroke;

    // Horizontal Highway
    final hPath = Path()..moveTo(0, size.height * 0.5)..lineTo(size.width, size.height * 0.5);
    canvas.drawPath(hPath, roadPaint);
    canvas.drawPath(hPath, roadBorderPaint);

    // Vertical Highway
    final vPath = Path()..moveTo(size.width * 0.5, 0)..lineTo(size.width * 0.5, size.height);
    canvas.drawPath(vPath, roadPaint);
    canvas.drawPath(vPath, roadBorderPaint);

    // Route line if both points exist
    if (pickup != null && destination != null) {
      final pX = size.width * (pickup!.x / 100);
      final pY = size.height * (pickup!.y / 100);
      final dX = size.width * (destination!.x / 100);
      final dY = size.height * (destination!.y / 100);

      final routePaint = Paint()
        ..color = const Color(0xFF16A34A)
        ..strokeWidth = 5
        ..style = PaintingStyle.stroke
        ..strokeCap = StrokeCap.round;

      final routePath = Path()
        ..moveTo(pX, pY)
        ..quadraticBezierTo((pX + dX) / 2 + 20, (pY + dY) / 2 - 20, dX, dY);
      canvas.drawPath(routePath, routePaint);

      // Draw Pickup Pin
      final pinPaint = Paint()..color = const Color(0xFF16A34A);
      canvas.drawCircle(Offset(pX, pY), 8, pinPaint);
      canvas.drawCircle(Offset(pX, pY), 4, Paint()..color = Colors.white);

      // Draw Destination Pin
      final destPaint = Paint()..color = const Color(0xFF17231B);
      canvas.drawCircle(Offset(dX, dY), 8, destPaint);
      canvas.drawCircle(Offset(dX, dY), 4, Paint()..color = Colors.white);
    }
  }

  @override
  bool shouldRepaint(covariant _MapPainter oldDelegate) {
    return oldDelegate.pickup?.id != pickup?.id || oldDelegate.destination?.id != destination?.id;
  }
}
