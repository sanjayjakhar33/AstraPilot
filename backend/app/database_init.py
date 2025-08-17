"""
Database initialization script for AstraPilot
Creates all tables and sets up initial admin user
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import async_session, create_tables
from app.models.user import User
from app.services.auth_service import get_password_hash
from app.settings import settings

async def create_admin_user():
    """Create initial admin user if not exists"""
    async with async_session() as session:
        # Check if admin user already exists
        result = await session.execute(
            select(User).where(User.username == settings.ADMIN_USERNAME)
        )
        admin_user = result.scalars().first()
        
        if not admin_user:
            # Create admin user
            hashed_password = get_password_hash("admin123")  # Change this password
            admin_user = User(
                username=settings.ADMIN_USERNAME,
                email=settings.ADMIN_EMAIL,
                hashed_password=hashed_password,
                is_active=True,
                is_superuser=True,
                email_verified=True  # Admin is pre-verified
            )
            session.add(admin_user)
            await session.commit()
            print(f"✅ Admin user created: {settings.ADMIN_USERNAME}")
            print(f"📧 Admin email: {settings.ADMIN_EMAIL}")
            print(f"🔑 Admin password: admin123 (Please change this!)")
        else:
            print(f"ℹ️  Admin user already exists: {settings.ADMIN_USERNAME}")

async def initialize_database():
    """Initialize database with all tables and admin user"""
    print("🚀 Initializing AstraPilot database...")
    
    # Create all tables
    await create_tables()
    print("✅ Database tables created successfully")
    
    # Create admin user
    await create_admin_user()
    
    print("🎉 Database initialization completed!")
    print("\n📊 Admin Dashboard Access:")
    print(f"   Username: {settings.ADMIN_USERNAME}")
    print(f"   Email: {settings.ADMIN_EMAIL}")
    print(f"   Password: admin123 (Please change this!)")
    print("\n🔗 Admin Endpoints:")
    print("   GET  /admin/dashboard/overview - Main dashboard")
    print("   GET  /admin/users - User management")
    print("   GET  /admin/payments - Payment management")
    print("   GET  /admin/system/health - System health")

if __name__ == "__main__":
    asyncio.run(initialize_database())