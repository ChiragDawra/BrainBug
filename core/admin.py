from django.contrib import admin
from core.models import Developer, CodeSession, BugPattern

@admin.register(Developer)
class DeveloperAdmin(admin.ModelAdmin):
    list_display = ('user', 'developer_id', 'experience_level', 'created_at')
    search_fields = ('user__username', 'preferred_language')
    list_filter = ('experience_level', 'created_at')

@admin.register(CodeSession)
class CodeSessionAdmin(admin.ModelAdmin):
    list_display = ('session_id', 'developer', 'language', 'start_time')
    search_fields = ('file_path', 'developer__user__username')
    list_filter = ('language', 'start_time')

@admin.register(BugPattern)
class BugPatternAdmin(admin.ModelAdmin):
    list_display = ('bug_type', 'developer', 'occurrence_count')
    search_fields = ('developer__user__username', 'bug_type')
    list_filter = ('bug_type', 'occurrence_count')