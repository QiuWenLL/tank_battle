// 音效管理器类
class SoundManager {
    constructor() {
        // 检查浏览器是否支持Web Audio API
        this.audioContext = null;
        this.sounds = {};
        this.enabled = true;
        
        this.initAudioContext();
        this.createSounds();
    }
    
    initAudioContext() {
        try {
            // 创建音频上下文
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Web Audio API 不支持', e);
            this.enabled = false;
        }
    }
    
    // 恢复音频上下文（处理浏览器的自动播放策略）
    resumeAudioContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }
    
    // 创建射击音效
    createShootSound() {
        if (!this.enabled || !this.audioContext) return null;
        
        return () => {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 设置音效参数 - 射击声音
                oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.type = 'square';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.1);
            } catch (e) {
                console.warn('播放射击音效失败:', e);
            }
        };
    }
    
    // 创建命中音效
    createHitSound() {
        if (!this.enabled || !this.audioContext) return null;
        
        return () => {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const noiseBuffer = this.createNoiseBuffer();
                const noiseSource = this.audioContext.createBufferSource();
                const noiseGain = this.audioContext.createGain();
                
                // 连接音频节点
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                noiseSource.buffer = noiseBuffer;
                noiseSource.connect(noiseGain);
                noiseGain.connect(this.audioContext.destination);
                
                // 设置爆炸音效参数
                oscillator.frequency.setValueAtTime(150, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.3);
                
                gainNode.gain.setValueAtTime(0.4, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                
                // 添加噪音效果
                noiseGain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                
                oscillator.type = 'sawtooth';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.3);
                
                noiseSource.start(this.audioContext.currentTime);
                noiseSource.stop(this.audioContext.currentTime + 0.2);
            } catch (e) {
                console.warn('播放命中音效失败:', e);
            }
        };
    }
    
    // 创建障碍物被击毁音效
    createBreakSound() {
        if (!this.enabled || !this.audioContext) return null;
        
        return () => {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                const noiseBuffer = this.createNoiseBuffer();
                const noiseSource = this.audioContext.createBufferSource();
                const noiseGain = this.audioContext.createGain();
                
                // 连接音频节点
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                noiseSource.buffer = noiseBuffer;
                noiseSource.connect(noiseGain);
                noiseGain.connect(this.audioContext.destination);
                
                // 设置破碎音效参数 - 更高频的破碎声
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.15);
                
                gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                
                // 添加噪音效果模拟破碎声
                noiseGain.gain.setValueAtTime(0.15, this.audioContext.currentTime);
                noiseGain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
                
                oscillator.type = 'triangle';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.15);
                
                noiseSource.start(this.audioContext.currentTime);
                noiseSource.stop(this.audioContext.currentTime + 0.1);
            } catch (e) {
                console.warn('播放破碎音效失败:', e);
            }
        };
    }
    
    // 创建移动音效
    createMoveSound() {
        if (!this.enabled || !this.audioContext) return null;
        
        return () => {
            try {
                const oscillator = this.audioContext.createOscillator();
                const gainNode = this.audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(this.audioContext.destination);
                
                // 设置移动音效参数 - 低频隆隆声
                oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime);
                oscillator.frequency.setValueAtTime(65, this.audioContext.currentTime + 0.05);
                oscillator.frequency.setValueAtTime(60, this.audioContext.currentTime + 0.1);
                
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
                
                oscillator.type = 'sawtooth';
                oscillator.start(this.audioContext.currentTime);
                oscillator.stop(this.audioContext.currentTime + 0.15);
            } catch (e) {
                console.warn('播放移动音效失败:', e);
            }
        };
    }
    
    // 创建噪音缓冲区用于爆炸效果
    createNoiseBuffer() {
        const bufferSize = this.audioContext.sampleRate * 0.2; // 0.2秒的噪音
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const output = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        
        return buffer;
    }
    
    // 创建所有音效
    createSounds() {
        this.sounds.shoot = this.createShootSound();
        this.sounds.hit = this.createHitSound();
        this.sounds.break = this.createBreakSound();
        this.sounds.move = this.createMoveSound();
    }
    
    // 播放音效
    play(soundName) {
        if (this.enabled && this.sounds[soundName]) {
            this.resumeAudioContext();
            this.sounds[soundName]();
        }
    }
    
    // 启用/禁用音效
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
    
    // 检查是否启用
    isEnabled() {
        return this.enabled;
    }
}
