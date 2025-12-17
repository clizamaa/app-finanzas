const { PrismaClient } = require('../src/generated/prisma-client');

const prisma = new PrismaClient();

async function ensureRoles() {
  try {
    console.log('🔎 Verificando existencia de roles...');

    const adminPermissions = JSON.stringify({
      articles: { create: true, read: true, update: true, delete: true, publish: true },
      users: { create: true, read: true, update: true, delete: true },
      comments: { moderate: true }
    });

    const editorPermissions = JSON.stringify({
      articles: { create: true, read: true, update: true, delete: false, publish: false },
      users: { create: false, read: false, update: false, delete: false },
      comments: { moderate: false }
    });

    const adminRole = await prisma.role.upsert({
      where: { id: 'admin_role_id' },
      update: {
        name: 'admin',
        description: 'Administrador con todos los permisos',
        permissions: adminPermissions,
      },
      create: {
        id: 'admin_role_id',
        name: 'admin',
        description: 'Administrador con todos los permisos',
        permissions: adminPermissions,
      }
    });

    const editorRole = await prisma.role.upsert({
      where: { id: 'editor_role_id' },
      update: {
        name: 'editor',
        description: 'Redactor que puede crear y editar artículos pero no publicar',
        permissions: editorPermissions,
      },
      create: {
        id: 'editor_role_id',
        name: 'editor',
        description: 'Redactor que puede crear y editar artículos pero no publicar',
        permissions: editorPermissions,
      }
    });

    console.log('✅ Roles asegurados/actualizados:');
    console.log({ adminRole, editorRole });

    // Asegurar que usuarios sin rol asignado tengan admin por defecto (opcional)
    const updatedUsers = await prisma.user.updateMany({
      where: { OR: [ { roleId: null }, { roleId: '' } ] },
      data: { roleId: 'admin_role_id' }
    });

    if (updatedUsers.count > 0) {
      console.log(`🔧 Usuarios actualizados para asignar rol por defecto: ${updatedUsers.count}`);
    }

    // Mostrar usuarios con su rol resuelto
    const users = await prisma.user.findMany({ include: { role: true } });
    console.log('\n👥 Usuarios y sus roles:');
    users.forEach(u => {
      console.log(`- ${u.email} -> ${u.role ? u.role.name : 'Sin rol'}`);
    });

    console.log('\n🎉 Listo.');
  } catch (error) {
    console.error('❌ Error asegurando roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

ensureRoles();