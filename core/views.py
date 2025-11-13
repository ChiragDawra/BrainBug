from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from ml_engine.detectors import BugDetector
from core.models import CodeSession, BugPattern
from django.contrib.auth.models import User
from django.utils import timezone
import json

@api_view(['POST'])
@permission_classes([AllowAny])
def analyze_code(request):
    code = request.data.get('code', '')
    language = request.data.get('language', 'python')
    file_path = request.data.get('file_path', 'unknown')
    user_id = request.data.get('user_id')
    
    # Create or get developer
    user = User.objects.filter(id=user_id).first() if user_id else None
    
    detector = BugDetector()
    issues = detector.analyze_code(code)
    
    # Store in database
    if user:
        from core.models import Developer
        developer = Developer.objects.filter(user=user).first()
        if developer:
            session = CodeSession.objects.create(
                developer=developer,
                file_path=file_path,
                language=language
            )
            
            # Store detected patterns
            for issue in issues:
                BugPattern.objects.create(
                    developer=developer,
                    bug_type=issue['type'],
                    pattern_description=issue['message'],
                    code_example=code[:200],
                    fixed_example='[Auto-generated fix pending]'
                )
    
    return Response({
        'issues_found': len(issues),
        'issues': issues,
        'session_id': session.session_id if user else None
    })