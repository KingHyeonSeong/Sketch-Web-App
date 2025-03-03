const express = require('express');
const fs = require('fs');
const os = require('os');
const { exec } = require('child_process');

const router = express.Router();

// Proc filesystem으로 CPU와 메모리 정보 수집
function getProcStats() {
    if (os.platform() !== 'linux') {
        console.warn('Non-Linux system detected. Returning mock data.');
        return {
            cpu: { idle: 1000, total: 5000 }, // Mock CPU 데이터
            memory: { totalMem: os.totalmem(), freeMem: os.freemem() }, // 실제 OS 데이터 사용
        };
    }

    try {
        const cpuStat = fs.readFileSync('/proc/stat', 'utf8').split('\n')[0]; // CPU 정보
        const memInfo = fs.readFileSync('/proc/meminfo', 'utf8').split('\n'); // 메모리 정보

        const totalMem = parseInt(memInfo[0].match(/\d+/)[0], 10); // MemTotal
        const freeMem = parseInt(memInfo[1].match(/\d+/)[0], 10); // MemFree

        const cpuValues = cpuStat.match(/\d+/g).map(Number);
        const idle = cpuValues[3];
        const total = cpuValues.reduce((acc, value) => acc + value, 0);

        return {
            cpu: { idle, total },
            memory: { totalMem, freeMem },
        };
    } catch (err) {
        console.error('Error reading /proc filesystem:', err);
        return {
            cpu: { idle: 1000, total: 5000 }, // Mock 데이터
            memory: { totalMem: os.totalmem(), freeMem: os.freemem() }, // 실제 OS 데이터 사용
        };
    }
}

// Mock 데이터 반환 함수
function getMockLunaData() {
    return {
        message: 'Mock data for non-Linux systems',
        services: [
            { name: 'Service1', status: 'running' },
            { name: 'Service2', status: 'stopped' },
        ],
    };
}

// Luna API로 시스템 자원 정보 가져오기 (getProcStat)
function getLunaProcStats(callback) {
    if (os.platform() !== 'linux') {
        console.warn('Non-Linux system detected. Returning mock Luna ProcStat data.');
        callback(null, getMockLunaData()); // Mock 데이터 반환
        return;
    }

    exec('luna-send -n 1 luna://com.webos.service.systemservice/getProcStat \'{}\'', (err, stdout) => {
        if (err) {
            console.error(`Error calling Luna API getProcStat: ${err}`);
            callback(err, null);
            return;
        }
        try {
            const procStatData = JSON.parse(stdout);
            callback(null, procStatData);
        } catch (parseErr) {
            console.error('Error parsing Luna API getProcStat response:', parseErr);
            callback(parseErr, null);
        }
    });
}

// Luna API로 시스템 내 서비스 목록 가져오기 (getUnitList)
function getLunaUnitList(callback) {
    if (os.platform() !== 'linux') {
        console.warn('Non-Linux system detected. Returning mock Luna UnitList data.');
        callback(null, getMockLunaData()); // Mock 데이터 반환
        return;
    }

    exec('luna-send -n 1 luna://com.webos.service.systemservice/getUnitList \'{}\'', (err, stdout) => {
        if (err) {
            console.error(`Error calling Luna API getUnitList: ${err}`);
            callback(err, null);
            return;
        }
        try {
            const unitListData = JSON.parse(stdout);
            callback(null, unitListData);
        } catch (parseErr) {
            console.error('Error parsing Luna API getUnitList response:', parseErr);
            callback(parseErr, null);
        }
    });
}

// /api/system-info 엔드포인트 정의
router.get('/system-info', (req, res) => {
    const procData = getProcStats();

    getLunaProcStats((errProc, lunaProcData) => {
        if (errProc) {
            console.warn('Failed to retrieve Luna ProcStat data. Returning mock data.');
            lunaProcData = getMockLunaData(); // Mock 데이터로 대체
        }

        getLunaUnitList((errUnit, lunaUnitData) => {
            if (errUnit) {
                console.warn('Failed to retrieve Luna UnitList data. Returning mock data.');
                lunaUnitData = getMockLunaData(); // Mock 데이터로 대체
            }

            res.json({
                procData,
                lunaProcData,
                lunaUnitData,
            });
        });
    });
});

module.exports = router;