"""
Test script to verify AstraPilot configuration and functionality
"""
import asyncio
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.settings import settings
from app.database import create_tables, async_session
from app.models.user import User
from sqlalchemy.future import select

async def test_database_connection():
    """Test database connectivity"""
    print("🔗 Testing database connection...")
    try:
        async with async_session() as session:
            result = await session.execute(select(1))
            print("✅ Database connection successful!")
            return True
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return False

async def test_table_creation():
    """Test database table creation"""
    print("📊 Testing table creation...")
    try:
        await create_tables()
        print("✅ Database tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Table creation failed: {e}")
        return False

async def test_user_operations():
    """Test basic user operations"""
    print("👤 Testing user operations...")
    try:
        async with async_session() as session:
            # Count existing users
            result = await session.execute(select(User))
            users = result.scalars().all()
            print(f"✅ Found {len(users)} users in database")
            return True
    except Exception as e:
        print(f"❌ User operations failed: {e}")
        return False

def test_email_configuration():
    """Test email configuration"""
    print("📧 Testing email configuration...")
    try:
        from app.utils.email import send_email
        print(f"  SMTP Host: {settings.SMTP_HOST}")
        print(f"  SMTP Port: {settings.SMTP_PORT}")
        print(f"  SMTP Username: {settings.SMTP_USERNAME}")
        print(f"  From Email: {settings.SMTP_FROM_EMAIL}")
        print("✅ Email configuration loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Email configuration failed: {e}")
        return False

def test_openai_configuration():
    """Test OpenAI configuration"""
    print("🤖 Testing OpenAI configuration...")
    try:
        if settings.OPENAI_API_KEY:
            print(f"  OpenAI API Key: {settings.OPENAI_API_KEY[:20]}...")
            print("✅ OpenAI API key configured!")
            return True
        else:
            print("⚠️  OpenAI API key not configured")
            return False
    except Exception as e:
        print(f"❌ OpenAI configuration failed: {e}")
        return False

async def run_all_tests():
    """Run all tests"""
    print("🚀 Starting AstraPilot Configuration Tests...")
    print(f"📝 Project: {settings.PROJECT_NAME} v{settings.PROJECT_VERSION}")
    print()
    
    tests = [
        ("Configuration", test_email_configuration),
        ("OpenAI", test_openai_configuration),
        ("Database Connection", test_database_connection),
        ("Table Creation", test_table_creation),
        ("User Operations", test_user_operations),
    ]
    
    results = []
    for test_name, test_func in tests:
        if asyncio.iscoroutinefunction(test_func):
            result = await test_func()
        else:
            result = test_func()
        results.append((test_name, result))
        print()
    
    print("📋 Test Results Summary:")
    print("=" * 40)
    passed = 0
    for test_name, result in results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"  {test_name}: {status}")
        if result:
            passed += 1
    
    print("=" * 40)
    print(f"Tests passed: {passed}/{len(results)}")
    
    if passed == len(results):
        print("\n🎉 All tests passed! AstraPilot is ready for production!")
    else:
        print(f"\n⚠️  {len(results) - passed} tests failed. Please check configuration.")
    
    return passed == len(results)

if __name__ == "__main__":
    asyncio.run(run_all_tests())