#include <iostream>
#include <fstream>
#include <thread>
#include <chrono>
#include <mutex>
#include <pthread.h>
#include <sched.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <unistd.h>
#include <cstring>
#include <cstdlib>

std::mutex sensor_mtx;
int shared_rpm = 2400;
int shared_radar = 55;
int shared_lidar = 62;
int shared_latency = 4;

// Thread 1: High-Priority ADAS Sensor Fusion (LiDAR + Radar)
void* adas_sensor_thread(void* arg) {
    struct sched_param param;
    param.sched_priority = 30; // Highest QNX RTOS Priority
    pthread_setschedparam(pthread_self(), SCHED_RR, &param);
    while (true) {
        {
            std::lock_guard<std::mutex> lock(sensor_mtx);
            shared_radar = 10 + (rand() % 85);
            shared_lidar = shared_radar + (rand() % 7 - 3);
            shared_latency = 3 + (rand() % 6);
        }
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
    }
    return nullptr;
}

// Thread 2: Powertrain & Black-Box Logger
void* powertrain_thread(void* arg) {
    while (true) {
        int r, rad, lid, lat;
        {
            std::lock_guard<std::mutex> lock(sensor_mtx);
            shared_rpm = 1600 + (rand() % 4200);
            r = shared_rpm; rad = shared_radar; lid = shared_lidar; lat = shared_latency;
        }
        std::ofstream logFile("qnx_blackbox.csv", std::ios::app);
        logFile << r << "RPM,RADAR:" << rad << "m,LIDAR:" << lid << "m," << lat << "us\n";
        logFile.close();
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }
    return nullptr;
}

// Thread 3: QNX Native IPC Socket Server (Port 9090)
int main() {
    std::cout << "[QNX 8.0 MICROKERNEL] Starting Multi-Threaded Sensor Fusion & IPC Socket...\n";
    pthread_t t1, t2;
    pthread_create(&t1, nullptr, adas_sensor_thread, nullptr);
    pthread_create(&t2, nullptr, powertrain_thread, nullptr);

    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    int opt = 1;
    setsockopt(server_fd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
    sockaddr_in addr{};
    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = INADDR_ANY;
    addr.sin_port = htons(9090);

    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(server_fd, 5);

    while (true) {
        int client = accept(server_fd, nullptr, nullptr);
        if (client >= 0) {
            char msg[128];
            {
                std::lock_guard<std::mutex> lock(sensor_mtx);
                snprintf(msg, sizeof(msg), "%d,%d,%d,%d", shared_rpm, shared_radar, shared_lidar, shared_latency);
            }
            send(client, msg, strlen(msg), 0);
            close(client);
        }
    }
    return 0;
}
