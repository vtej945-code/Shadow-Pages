// LEADERBOARD FIX - Add this to your existing script.js or include as separate file

// Enhanced Leaderboard Database System
class LeaderboardDatabase {
    constructor() {
        this.dbName = 'shadowPagesLeaderboard';
        this.participants = new Map();
        this.observers = [];
        this.autoSaveInterval = null;
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.startAutoSave();
        this.setupStorageListener();
    }

    loadFromStorage() {
        try {
            const data = localStorage.getItem(this.dbName);
            if (data) {
                const parsed = JSON.parse(data);
                this.participants = new Map(parsed.participants || []);
            }
        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            this.participants = new Map();
        }
    }

    saveToStorage() {
        try {
            const data = {
                participants: Array.from(this.participants.entries()),
                lastUpdated: Date.now()
            };
            localStorage.setItem(this.dbName, JSON.stringify(data));
            localStorage.setItem('leaderboardData', JSON.stringify(this.getLeaderboardArray()));
            this.notifyObservers();
        } catch (error) {
            console.error('Error saving leaderboard data:', error);
        }
    }

    startAutoSave() {
        this.autoSaveInterval = setInterval(() => {
            this.saveToStorage();
        }, 2000);
    }

    setupStorageListener() {
        window.addEventListener('storage', (e) => {
            if (e.key === this.dbName) {
                this.loadFromStorage();
                this.notifyObservers();
            }
        });
    }

    addObserver(callback) {
        this.observers.push(callback);
    }

    notifyObservers() {
        this.observers.forEach(callback => {
            try {
                callback(this.getLeaderboardArray());
            } catch (error) {
                console.error('Error notifying observer:', error);
            }
        });
    }

    updateParticipant(name, level, status, additionalData = {}) {
        const currentTime = Date.now();
        const existingParticipant = this.participants.get(name);
        
        // Determine participant's start time
        let participantStartTime;
        if (existingParticipant && existingParticipant.startTime) {
            participantStartTime = existingParticipant.startTime;
        } else if (additionalData.startTime) {
            participantStartTime = additionalData.startTime;
        } else {
            participantStartTime = currentTime; // Start time is now if not provided
        }
        
        // Calculate total elapsed time since participant started
        const totalElapsedTime = currentTime - participantStartTime;
        
        // Format total elapsed time as HH:MM:SS or MM:SS
        const formatElapsedTime = (milliseconds) => {
            const totalSeconds = Math.floor(milliseconds / 1000);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            
            if (hours > 0) {
                return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            } else {
                return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        };

        const participant = {
            name: name,
            level: Math.max(existingParticipant?.level || 0, level),
            status: status,
            time: formatElapsedTime(totalElapsedTime), // Total elapsed time since start
            totalTime: totalElapsedTime, // Total time in milliseconds
            timestamp: currentTime,
            startTime: participantStartTime, // When this participant started
            attempts: (existingParticipant?.attempts || 0) + (status === 'failed' ? 1 : 0),
            completedLevels: existingParticipant?.completedLevels || [],
            failedLevels: existingParticipant?.failedLevels || [],
            levelTimes: existingParticipant?.levelTimes || {}, // Track time for each level
            ...additionalData
        };

        // Store the time taken for this specific level
        participant.levelTimes[level] = {
            time: totalElapsedTime,
            timeString: formatElapsedTime(totalElapsedTime),
            status: status,
            timestamp: currentTime
        };

        if (status === 'completed' && !participant.completedLevels.includes(level)) {
            participant.completedLevels.push(level);
            participant.completedLevels.sort((a, b) => a - b);
        } else if (status === 'failed' && !participant.failedLevels.includes(level)) {
            participant.failedLevels.push(level);
        }

        // Special handling for champions (completed all 5 levels)
        if (level === 5 && status === 'completed') {
            participant.status = 'completed'; // Mark as completed instead of champion
            participant.completionTime = currentTime;
        }

        this.participants.set(name, participant);
        this.saveToStorage();

        console.log(`✅ Leaderboard updated: ${name} - Level ${level} - ${status} - Total Time: ${participant.time}`);
        return participant;
    }

    getLeaderboardArray() {
        const participants = Array.from(this.participants.values());

        return participants.sort((a, b) => {
            // Completed participants (finished all 5 levels) first
            if (a.status === 'completed' && b.status !== 'completed') return -1;
            if (b.status === 'completed' && a.status !== 'completed') return 1;

            // Among completed participants, sort by total time (fastest first)
            if (a.status === 'completed' && b.status === 'completed') {
                return a.totalTime - b.totalTime;
            }

            // Among non-completed, sort by level progress (highest level first)
            if (a.level !== b.level) {
                return b.level - a.level;
            }

            // If same level, sort by total time (fastest first)
            return a.totalTime - b.totalTime;
        });
    }

    removeParticipant(name) {
        const removed = this.participants.delete(name);
        if (removed) {
            this.saveToStorage();
        }
        return removed;
    }

    clearAll() {
        this.participants.clear();
        this.saveToStorage();
    }
}

// Enhanced Animated Leaderboard
class AnimatedLeaderboard {
    constructor() {
        this.leaderboardBody = document.getElementById('leaderboard-body');
        this.refreshIndicator = document.getElementById('refresh-indicator');
        this.participants = [];
        // Removed auto-refresh functionality
        // this.updateInterval = null;

        this.init();
        // Removed auto-refresh start
        // this.startRealTimeUpdates();
    }

    init() {
        if (window.leaderboardDB) {
            window.leaderboardDB.addObserver((data) => {
                console.log('🔄 Leaderboard data updated via observer:', data.length, 'participants');
                this.participants = data;
                this.renderLeaderboard();
            });
        }

        this.loadLeaderboardData();
        this.renderLeaderboard();
    }

    // Removed auto-refresh functionality - leaderboard updates only on manual refresh or data changes
    // startRealTimeUpdates() {
    //     this.updateInterval = setInterval(() => {
    //         this.loadLeaderboardData();
    //         this.renderLeaderboard();
    //         this.updateRefreshIndicator();
    //     }, 1000);
    // }

    // updateRefreshIndicator() {
    //     if (this.refreshIndicator) {
    //         this.refreshIndicator.style.animation = 'none';
    //         setTimeout(() => {
    //             this.refreshIndicator.style.animation = 'pulse 1s ease-in-out';
    //         }, 10);
    //     }
    // }

    loadLeaderboardData() {
        if (window.leaderboardDB) {
            const dbData = window.leaderboardDB.getLeaderboardArray();
            if (dbData.length > 0) {
                this.participants = dbData;
                return;
            }
        }

        const realData = JSON.parse(localStorage.getItem('leaderboardData') || '[]');

        if (realData.length === 0) {
            const currentTime = Date.now();
            this.participants = [
                { 
                    name: 'CyberNinja', 
                    level: 5, 
                    status: 'completed', 
                    timestamp: currentTime - 1000000,
                    startTime: currentTime - 1754000, // Started 29:14 ago
                    totalTime: 1754000, // 29 minutes 14 seconds total
                    time: '29:14'
                },
                { 
                    name: 'CodeMaster', 
                    level: 4, 
                    status: 'active', 
                    timestamp: currentTime - 800000,
                    startTime: currentTime - 1322000, // Started 22:02 ago
                    totalTime: 1322000, // 22 minutes 2 seconds total
                    time: '22:02'
                },
                { 
                    name: 'HackWizard', 
                    level: 4, 
                    status: 'active', 
                    timestamp: currentTime - 700000,
                    startTime: currentTime - 1605000, // Started 26:45 ago
                    totalTime: 1605000, // 26 minutes 45 seconds total
                    time: '26:45'
                },
                { 
                    name: 'DataGhost', 
                    level: 3, 
                    status: 'active', 
                    timestamp: currentTime - 600000,
                    startTime: currentTime - 1092000, // Started 18:12 ago
                    totalTime: 1092000, // 18 minutes 12 seconds total
                    time: '18:12'
                },
                { 
                    name: 'ByteHunter', 
                    level: 3, 
                    status: 'failed', 
                    timestamp: currentTime - 500000,
                    startTime: currentTime - 1173000, // Started 19:33 ago
                    totalTime: 1173000, // 19 minutes 33 seconds total
                    time: '19:33'
                }
            ];
        } else {
            this.participants = realData;
        }

        this.participants = this.participants.slice(0, 10);
    }

    renderLeaderboard() {
        if (!this.leaderboardBody) {
            console.log('❌ Leaderboard body element not found');
            return;
        }

        console.log('🎯 Rendering leaderboard with', this.participants.length, 'participants');

        if (this.participants.length === 0) {
            this.leaderboardBody.innerHTML = `
                <div class="empty-leaderboard">
                    <div class="empty-leaderboard-icon">🏆</div>
                    <h3>No participants yet</h3>
                    <p>Be the first to take on the Shadow Pages challenge!</p>
                </div>
            `;
            return;
        }

        this.leaderboardBody.innerHTML = '';

        this.participants.forEach((participant, index) => {
            const entry = document.createElement('div');
            entry.className = 'leaderboard-entry';
            // Remove animation delay
            // entry.style.animationDelay = `${index * 0.1}s`;

            if (participant.status === 'champion') {
                entry.classList.add('champion-participant');
            } else if (participant.status === 'completed') {
                entry.classList.add('completed-participant');
            } else if (participant.status === 'failed') {
                entry.classList.add('failed-participant');
            }

            // Remove new entry animation
            // if (participant.isNew) {
            //     entry.classList.add('new-entry');
            //     setTimeout(() => {
            //         entry.classList.remove('new-entry');
            //         participant.isNew = false;
            //     }, 2000);
            // }

            const rankClass = index === 0 ? 'first' : index === 1 ? 'second' : index === 2 ? 'third' : '';
            const statusColor = participant.status === 'champion' ? '#ffd700' :
                participant.status === 'completed' ? '#00ff00' :
                    participant.status === 'active' ? 'var(--neon-blue)' :
                        participant.status === 'failed' ? '#ff0040' : 'var(--neon-pink)';

            // Remove status icons for cleaner display
            const statusText = participant.status.toUpperCase();

            entry.innerHTML = `
                <div class="rank ${rankClass}">#${index + 1}</div>
                <div class="participant-name">
                    ${participant.name}
                    ${participant.attempts > 0 ? `<span class="attempts">(${participant.attempts} attempts)</span>` : ''}
                </div>
                <div class="level-progress">${participant.level}/5</div>
                <div class="completion-time">${participant.time}</div>
                <div class="participant-status" style="color: ${statusColor}">
                    ${statusText}
                </div>
            `;

            this.leaderboardBody.appendChild(entry);
        });

        console.log('✅ Leaderboard rendered successfully');
    }

    forceRefresh() {
        console.log('🔄 Force refreshing leaderboard...');
        this.loadLeaderboardData();
        this.renderLeaderboard();
    }

    addParticipant(participantData) {
        participantData.isNew = true;
        this.participants.unshift(participantData);
        this.participants = this.participants.slice(0, 10);
        this.renderLeaderboard();
    }

    destroy() {
        // Auto-refresh functionality removed - no intervals to clear
        console.log('Leaderboard destroyed');
    }
}

// Enhanced leaderboard functions
function initializeUserInLeaderboard(participantName, startTime) {
    console.log('🚀 Initializing user in leaderboard:', participantName);

    if (!window.leaderboardDB) {
        console.error('❌ LeaderboardDB not initialized');
        return;
    }

    window.leaderboardDB.updateParticipant(participantName, 1, 'active', {
        startTime: startTime || Date.now()
    });

    console.log('✅ User initialized successfully');
}

function updateLeaderboardProgress(participantName, level, status) {
    console.log('📊 Updating leaderboard progress:', participantName, level, status);

    if (!window.leaderboardDB) {
        console.error('❌ LeaderboardDB not initialized');
        return;
    }

    const participant = window.leaderboardDB.updateParticipant(participantName, level, status);

    if (window.animatedLeaderboard) {
        window.animatedLeaderboard.forceRefresh();
    }

    return participant;
}

function handleLevelCompletion(participantName, level) {
    console.log('🎉 Level completed:', participantName, level);

    const nextLevel = level + 1;
    const status = nextLevel > 5 ? 'champion' : 'active';

    return updateLeaderboardProgress(participantName, nextLevel > 5 ? 5 : nextLevel, status);
}

function handleLevelFailure(participantName, level) {
    console.log('💥 Level failed:', participantName, level);

    return updateLeaderboardProgress(participantName, level, 'failed');
}

function resetUserProgress(participantName) {
    console.log('🔄 Resetting user progress:', participantName);

    if (window.leaderboardDB) {
        window.leaderboardDB.removeParticipant(participantName);
    }

    const startTime = Date.now();
    localStorage.setItem('challengeStartTime', startTime.toString());

    return initializeUserInLeaderboard(participantName, startTime);
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎯 Initializing leaderboard system...');

    // Initialize database
    if (!window.leaderboardDB) {
        window.leaderboardDB = new LeaderboardDatabase();
    }

    // Initialize leaderboard display
    if (!window.animatedLeaderboard) {
        window.animatedLeaderboard = new AnimatedLeaderboard();
    }

    console.log('✅ Leaderboard system initialized');
});

// Test function to verify the system works
function testLeaderboardUpdate() {
    console.log('🧪 Testing leaderboard update...');

    const testName = 'TestUser_' + Math.floor(Math.random() * 1000);
    const testLevel = Math.floor(Math.random() * 5) + 1;
    const testStatus = ['active', 'completed', 'failed'][Math.floor(Math.random() * 3)];

    updateLeaderboardProgress(testName, testLevel, testStatus);

    console.log('✅ Test completed');
}

// Make test function available globally
window.testLeaderboardUpdate = testLeaderboardUpdate;