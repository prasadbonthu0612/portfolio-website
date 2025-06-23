// Admin Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const contentSections = document.querySelectorAll('.content-section');
    const sectionTitle = document.getElementById('section-title');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.classList.remove('active'));
            contentSections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const targetSection = this.getAttribute('data-section');
            const section = document.getElementById(targetSection);
            if (section) {
                section.classList.add('active');
                
                // Update section title
                const title = this.textContent.trim();
                if (sectionTitle) {
                    sectionTitle.textContent = title;
                }
            }
        });
    });
    
    // Profile Image Upload Functionality
    const profileImageInput = document.getElementById('profile-image-input');
    const profileImagePreview = document.getElementById('profile-image-preview');
    
    if (profileImageInput) {
        profileImageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    showNotification('Please select a valid image file', 'error');
                    return;
                }
                
                // Validate file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Image size should be less than 5MB', 'error');
                    return;
                }
                
                // Show preview
                const reader = new FileReader();
                reader.onload = function(e) {
                    profileImagePreview.src = e.target.result;
                };
                reader.readAsDataURL(file);
                
                // Upload image
                uploadProfileImage(file);
            }
        });
    }
    
    // Upload profile image function
    window.uploadProfileImage = function(file) {
        const formData = new FormData();
        formData.append('image', file);
        
        // Show upload progress
        showUploadProgress();
        
        fetch('/api/profile/image', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            hideUploadProgress();
            if (data.success) {
                showNotification('Profile image uploaded successfully!', 'success');
                // Update the image URL in the database
                updateProfileImageUrl(data.image_url);
            } else {
                showNotification('Error uploading image: ' + data.error, 'error');
            }
        })
        .catch(error => {
            hideUploadProgress();
            showNotification('Error uploading image: ' + error.message, 'error');
        });
    };
    
    // Remove profile image function
    window.removeProfileImage = function() {
        if (confirm('Are you sure you want to remove your profile image?')) {
            fetch('/api/profile/image', {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    profileImagePreview.src = '/static/images/default-avatar.svg';
                    showNotification('Profile image removed successfully!', 'success');
                    // Update the image URL in the database
                    updateProfileImageUrl(null);
                } else {
                    showNotification('Error removing image: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showNotification('Error removing image: ' + error.message, 'error');
            });
        }
    };
    
    // Update profile image URL in database
    function updateProfileImageUrl(imageUrl) {
        const profileData = {
            profile_image: imageUrl
        };
        
        fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                console.error('Error updating profile image URL:', data.error);
            }
        })
        .catch(error => {
            console.error('Error updating profile image URL:', error);
        });
    }
    
    // Show upload progress
    function showUploadProgress() {
        // Create progress bar if it doesn't exist
        let progressContainer = document.querySelector('.upload-progress');
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'upload-progress';
            progressContainer.innerHTML = `
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div class="progress-text">Uploading image...</div>
            `;
            
            const imageUploadControls = document.querySelector('.image-upload-controls');
            if (imageUploadControls) {
                imageUploadControls.appendChild(progressContainer);
            }
        }
        
        progressContainer.style.display = 'block';
        
        // Simulate progress
        const progressFill = progressContainer.querySelector('.progress-fill');
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 90) progress = 90;
            progressFill.style.width = progress + '%';
        }, 200);
        
        // Store interval for cleanup
        progressContainer.dataset.interval = interval;
    }
    
    // Hide upload progress
    function hideUploadProgress() {
        const progressContainer = document.querySelector('.upload-progress');
        if (progressContainer) {
            // Clear interval
            if (progressContainer.dataset.interval) {
                clearInterval(progressContainer.dataset.interval);
            }
            
            // Complete progress
            const progressFill = progressContainer.querySelector('.progress-fill');
            progressFill.style.width = '100%';
            
            // Hide after a short delay
            setTimeout(() => {
                progressContainer.style.display = 'none';
                progressFill.style.width = '0%';
            }, 500);
        }
    }
    
    // Modal functionality
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        }
    }
    
    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Close modal with X button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });
    
    // Make closeModal function global
    window.closeModal = closeModal;
    
    // Profile Management
    window.saveProfile = function() {
        const profileData = {
            name: document.getElementById('profile-name').value,
            title: document.getElementById('profile-title').value,
            subtitle: document.getElementById('profile-subtitle').value,
            email: document.getElementById('profile-email').value,
            phone: document.getElementById('profile-phone').value,
            location: document.getElementById('profile-location').value,
            about: document.getElementById('profile-about').value,
            github_url: document.getElementById('profile-github').value,
            linkedin_url: document.getElementById('profile-linkedin').value
        };
        
        console.log('Saving profile with data:', profileData);
        
        fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        })
        .then(response => {
            console.log('Response status:', response.status);
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);
            if (data.success) {
                showNotification('Profile updated successfully!', 'success');
            } else {
                showNotification('Error updating profile: ' + data.error, 'error');
            }
        })
        .catch(error => {
            console.error('Error saving profile:', error);
            showNotification('Error updating profile: ' + error.message, 'error');
        });
    };
    
    // Skills Management
    let currentSkillId = null;
    
    window.showAddSkillModal = function() {
        currentSkillId = null;
        document.getElementById('skillModalTitle').textContent = 'Add New Skill';
        document.getElementById('skillForm').reset();
        showModal('skillModal');
    };
    
    window.editSkill = function(skillId) {
        currentSkillId = skillId;
        document.getElementById('skillModalTitle').textContent = 'Edit Skill';
        
        // Fetch skill data from server and populate form
        fetch(`/api/skills/${skillId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const skill = data.skill;
                document.getElementById('skill-name').value = skill.name || '';
                document.getElementById('skill-icon').value = skill.icon || '';
                document.getElementById('skill-proficiency').value = skill.proficiency || 0;
                document.getElementById('skill-order').value = skill.order_index || 0;
                showModal('skillModal');
            } else {
                showNotification('Error loading skill data: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error loading skill data: ' + error.message, 'error');
        });
    };
    
    window.deleteSkill = function(skillId) {
        if (confirm('Are you sure you want to delete this skill?')) {
            fetch(`/api/skills/${skillId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`[data-id="${skillId}"]`).remove();
                    showNotification('Skill deleted successfully!', 'success');
                } else {
                    showNotification('Error deleting skill: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showNotification('Error deleting skill: ' + error.message, 'error');
            });
        }
    };
    
    // Skill form submission
    document.getElementById('skillForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const skillData = {
            name: document.getElementById('skill-name').value,
            icon: document.getElementById('skill-icon').value,
            proficiency: parseInt(document.getElementById('skill-proficiency').value),
            order_index: parseInt(document.getElementById('skill-order').value) || 0
        };
        
        const url = currentSkillId ? `/api/skills/${currentSkillId}` : '/api/skills';
        const method = currentSkillId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(skillData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal('skillModal');
                showNotification(currentSkillId ? 'Skill updated successfully!' : 'Skill added successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showNotification('Error saving skill: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error saving skill: ' + error.message, 'error');
        });
    });
    
    // Projects Management
    let currentProjectId = null;
    
    window.showAddProjectModal = function() {
        currentProjectId = null;
        document.getElementById('projectModalTitle').textContent = 'Add New Project';
        document.getElementById('projectForm').reset();
        showModal('projectModal');
    };
    
    window.editProject = function(projectId) {
        currentProjectId = projectId;
        document.getElementById('projectModalTitle').textContent = 'Edit Project';
        
        // Fetch project data from server and populate form
        fetch(`/api/projects/${projectId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const project = data.project;
                document.getElementById('project-title').value = project.title || '';
                document.getElementById('project-description').value = project.description || '';
                document.getElementById('project-technologies').value = project.technologies || '';
                document.getElementById('project-image').value = project.image || '';
                document.getElementById('project-live-url').value = project.live_url || '';
                document.getElementById('project-github-url').value = project.github_url || '';
                showModal('projectModal');
            } else {
                showNotification('Error loading project data: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error loading project data: ' + error.message, 'error');
        });
    };
    
    window.deleteProject = function(projectId) {
        if (confirm('Are you sure you want to delete this project?')) {
            fetch(`/api/projects/${projectId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`[data-id="${projectId}"]`).remove();
                    showNotification('Project deleted successfully!', 'success');
                } else {
                    showNotification('Error deleting project: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showNotification('Error deleting project: ' + error.message, 'error');
            });
        }
    };
    
    // Project form submission
    document.getElementById('projectForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const projectData = {
            title: document.getElementById('project-title').value,
            description: document.getElementById('project-description').value,
            technologies: document.getElementById('project-technologies').value,
            image: document.getElementById('project-image').value,
            live_url: document.getElementById('project-live-url').value,
            github_url: document.getElementById('project-github-url').value
        };
        
        const url = currentProjectId ? `/api/projects/${currentProjectId}` : '/api/projects';
        const method = currentProjectId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(projectData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal('projectModal');
                showNotification(currentProjectId ? 'Project updated successfully!' : 'Project added successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showNotification('Error saving project: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error saving project: ' + error.message, 'error');
        });
    });
    
    // Experience Management
    let currentExperienceId = null;
    
    window.showAddExperienceModal = function() {
        currentExperienceId = null;
        document.getElementById('experienceModalTitle').textContent = 'Add New Experience';
        document.getElementById('experienceForm').reset();
        showModal('experienceModal');
    };
    
    window.editExperience = function(experienceId) {
        currentExperienceId = experienceId;
        document.getElementById('experienceModalTitle').textContent = 'Edit Experience';
        
        // Fetch experience data from server and populate form
        fetch(`/api/experience/${experienceId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const experience = data.experience;
                document.getElementById('exp-position').value = experience.position || '';
                document.getElementById('exp-company').value = experience.company || '';
                document.getElementById('exp-start-date').value = experience.start_date || '';
                document.getElementById('exp-end-date').value = experience.end_date || '';
                document.getElementById('exp-description').value = experience.description || '';
                document.getElementById('exp-technologies').value = experience.technologies || '';
                showModal('experienceModal');
            } else {
                showNotification('Error loading experience data: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error loading experience data: ' + error.message, 'error');
        });
    };
    
    window.deleteExperience = function(experienceId) {
        if (confirm('Are you sure you want to delete this experience?')) {
            fetch(`/api/experience/${experienceId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`[data-id="${experienceId}"]`).remove();
                    showNotification('Experience deleted successfully!', 'success');
                } else {
                    showNotification('Error deleting experience: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showNotification('Error deleting experience: ' + error.message, 'error');
            });
        }
    };
    
    // Experience form submission
    document.getElementById('experienceForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const experienceData = {
            position: document.getElementById('exp-position').value,
            company: document.getElementById('exp-company').value,
            start_date: document.getElementById('exp-start-date').value,
            end_date: document.getElementById('exp-end-date').value || null,
            description: document.getElementById('exp-description').value,
            technologies: document.getElementById('exp-technologies').value
        };
        
        const url = currentExperienceId ? `/api/experience/${currentExperienceId}` : '/api/experience';
        const method = currentExperienceId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(experienceData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal('experienceModal');
                showNotification(currentExperienceId ? 'Experience updated successfully!' : 'Experience added successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showNotification('Error saving experience: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error saving experience: ' + error.message, 'error');
        });
    });
    
    // Certifications Management
    let currentCertificationId = null;
    
    window.showAddCertificationModal = function() {
        currentCertificationId = null;
        document.getElementById('certificationModalTitle').textContent = 'Add New Certification';
        document.getElementById('certificationForm').reset();
        showModal('certificationModal');
    };
    
    window.editCertification = function(certificationId) {
        currentCertificationId = certificationId;
        document.getElementById('certificationModalTitle').textContent = 'Edit Certification';
        
        // Fetch certification data from server and populate form
        fetch(`/api/certifications/${certificationId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const certification = data.certification;
                document.getElementById('cert-title').value = certification.title || '';
                document.getElementById('cert-issuer').value = certification.issuer || '';
                document.getElementById('cert-issue-date').value = certification.issue_date || '';
                document.getElementById('cert-icon').value = certification.icon || '';
                document.getElementById('cert-credential-url').value = certification.credential_url || '';
                showModal('certificationModal');
            } else {
                showNotification('Error loading certification data: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error loading certification data: ' + error.message, 'error');
        });
    };
    
    window.deleteCertification = function(certificationId) {
        if (confirm('Are you sure you want to delete this certification?')) {
            fetch(`/api/certifications/${certificationId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.querySelector(`[data-id="${certificationId}"]`).remove();
                    showNotification('Certification deleted successfully!', 'success');
                } else {
                    showNotification('Error deleting certification: ' + data.error, 'error');
                }
            })
            .catch(error => {
                showNotification('Error deleting certification: ' + error.message, 'error');
            });
        }
    };
    
    // Certification form submission
    document.getElementById('certificationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const certificationData = {
            title: document.getElementById('cert-title').value,
            issuer: document.getElementById('cert-issuer').value,
            issue_date: document.getElementById('cert-issue-date').value,
            icon: document.getElementById('cert-icon').value,
            credential_url: document.getElementById('cert-credential-url').value
        };
        
        const url = currentCertificationId ? `/api/certifications/${currentCertificationId}` : '/api/certifications';
        const method = currentCertificationId ? 'PUT' : 'POST';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(certificationData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                closeModal('certificationModal');
                showNotification(currentCertificationId ? 'Certification updated successfully!' : 'Certification added successfully!', 'success');
                setTimeout(() => location.reload(), 1000);
            } else {
                showNotification('Error saving certification: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error saving certification: ' + error.message, 'error');
        });
    });
    
    // Notification system
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.admin-notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#d1fae5' : type === 'error' ? '#fee2e2' : '#dbeafe'};
            color: ${type === 'success' ? '#065f46' : type === 'error' ? '#991b1b' : '#1e40af'};
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 400px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Make showNotification function global
    window.showNotification = showNotification;
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal[style*="display: block"]');
            if (openModal) {
                closeModal(openModal.id);
            }
        }
        
        // Ctrl/Cmd + S to save profile
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            if (document.getElementById('profile').classList.contains('active')) {
                saveProfile();
            }
        }
    });
    
    // Auto-save functionality for profile
    let profileTimeout;
    const profileInputs = document.querySelectorAll('#profile input, #profile textarea');
    profileInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(profileTimeout);
            profileTimeout = setTimeout(() => {
                saveProfile();
            }, 2000); // Auto-save after 2 seconds of inactivity
        });
    });
    
    // Initialize tooltips for icons
    const iconInputs = document.querySelectorAll('input[id*="icon"]');
    iconInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.title = 'Enter FontAwesome icon class (e.g., fas fa-code, fab fa-js)';
        });
    });
    
    // Form validation
    function validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#dc2626';
                isValid = false;
            } else {
                field.style.borderColor = '#e5e7eb';
            }
        });
        
        return isValid;
    }
    
    // Add validation to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            if (!validateForm(this)) {
                e.preventDefault();
                showNotification('Please fill in all required fields', 'error');
            }
        });
    });
    
    // Update profile image URL manually
    window.updateProfileImageUrl = function() {
        const imageUrl = document.getElementById('profile-image-url').value.trim();
        
        if (!imageUrl) {
            showNotification('Please enter a valid image URL', 'error');
            return;
        }
        
        // Validate URL
        try {
            new URL(imageUrl);
        } catch (e) {
            showNotification('Please enter a valid URL', 'error');
            return;
        }
        
        // Update preview
        document.getElementById('profile-image-preview').src = imageUrl;
        
        // Update database
        const profileData = {
            profile_image: imageUrl
        };
        
        fetch('/api/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showNotification('Profile image updated successfully!', 'success');
            } else {
                showNotification('Error updating profile image: ' + data.error, 'error');
            }
        })
        .catch(error => {
            showNotification('Error updating profile image: ' + error.message, 'error');
        });
    };
}); 