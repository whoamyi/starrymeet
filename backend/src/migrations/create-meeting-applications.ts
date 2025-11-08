/**
 * Migration: Create Meeting Applications Schema
 *
 * Creates table for professional and personal meeting applications:
 * - meeting_applications: Stores both professional and personal applications
 */

import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  console.log('📝 Creating meeting applications schema...\n');

  // ============================================
  // MEETING_APPLICATIONS TABLE
  // ============================================
  console.log('📋 Creating meeting_applications table...');
  await queryInterface.createTable('meeting_applications', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      comment: 'Unique application identifier'
    },
    application_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: 'Human-readable application number (e.g., APP-1234567890-ABC123)'
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
      comment: 'User who submitted the application'
    },
    celebrity_id: {
      type: DataTypes.UUID,
      allowNull: false,
      comment: 'Celebrity the application is for'
    },
    application_type: {
      type: DataTypes.ENUM('professional', 'personal'),
      allowNull: false,
      comment: 'Type of meeting application'
    },
    status: {
      type: DataTypes.ENUM('pending', 'under_review', 'approved', 'rejected', 'cancelled'),
      allowNull: false,
      defaultValue: 'pending',
      comment: 'Application status'
    },

    // Common fields for both types
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Applicant first name'
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: 'Applicant last name'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Applicant email'
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'Applicant phone number'
    },

    // Professional application fields
    professional_summary: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Professional background summary (max 2500 chars)'
    },
    why_celebrity: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Why this specific celebrity (max 2000 chars)'
    },
    meeting_goals: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Meeting goals and outcomes (max 1500 chars)'
    },
    what_you_bring: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Value proposition (max 1500 chars)'
    },
    next_steps: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Proposed next steps (max 1000 chars)'
    },
    linkedin_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'LinkedIn profile URL'
    },
    company_website: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Company website URL'
    },
    portfolio_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Portfolio URL'
    },
    social_media: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Other social media links'
    },

    // Personal application fields
    your_story: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Personal story (max 2500 chars)'
    },
    what_they_mean: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'What the celebrity means to them (max 2000 chars)'
    },
    why_now: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Why this meeting matters now (max 1250 chars)'
    },
    meeting_vision: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Vision for the meeting (max 1500 chars)'
    },
    your_case: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Why they should be chosen (max 1500 chars)'
    },
    additional_context: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Additional context (max 1000 chars)'
    },
    instagram_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Instagram profile URL'
    },
    personal_links: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Personal links or references'
    },

    // Review fields
    review_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Internal review notes'
    },
    reviewed_at: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'When the application was reviewed'
    },
    reviewed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      comment: 'Who reviewed the application'
    },

    // Timestamps
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  });

  // Add indexes for common queries
  await queryInterface.addIndex('meeting_applications', ['application_number'], {
    name: 'idx_applications_number',
    unique: true
  });

  await queryInterface.addIndex('meeting_applications', ['user_id'], {
    name: 'idx_applications_user_id'
  });

  await queryInterface.addIndex('meeting_applications', ['celebrity_id'], {
    name: 'idx_applications_celebrity_id'
  });

  await queryInterface.addIndex('meeting_applications', ['status'], {
    name: 'idx_applications_status'
  });

  await queryInterface.addIndex('meeting_applications', ['application_type'], {
    name: 'idx_applications_type'
  });

  await queryInterface.addIndex('meeting_applications', ['created_at'], {
    name: 'idx_applications_created_at'
  });

  // Composite index for common queries
  await queryInterface.addIndex('meeting_applications', ['user_id', 'status'], {
    name: 'idx_applications_user_status'
  });

  await queryInterface.addIndex('meeting_applications', ['celebrity_id', 'status'], {
    name: 'idx_applications_celebrity_status'
  });

  console.log('✅ Meeting_applications table created\n');
  console.log('🎉 Meeting applications schema created successfully!\n');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  console.log('🗑️  Rolling back meeting applications schema...\n');

  await queryInterface.dropTable('meeting_applications');

  console.log('✅ Rollback complete\n');
}
