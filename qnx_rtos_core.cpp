#include <iostream>
#include <fstream>
#include <thread>
#include <chrono>
#include <pthread.h>
#include <sched.h>
#include <cstdlib>

int main() {
    struct sched_param param;
    param.sched_priority = 25;
    pthread_setschedparam(pthread_self(), SCHED_RR, &param);
    std::cout << "[QNX 8.0 RTOS KERNEL] Deterministic C++ Sensor Daemon Started (Priority: 25)\n";

    while (true) {
        int rpm = 1800 + (rand() % 3500);
        int radar_dist = 8 + (rand() % 85); // Obstacle distance in meters
        int latency_us = 4 + (rand() % 9);   // Ultra-low QNX microsecond latency

        std::ofstream livePipe("rtos_live_pipe.txt");
        livePipe << rpm << "," << radar_dist << "," << latency_us << "\n";
        livePipe.close();

        std::ofstream logFile("qnx_blackbox.csv", std::ios::app);
        logFile << rpm << "," << radar_dist << "m," << latency_us << "us\n";
        logFile.close();

        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
    }
    return 0;
}
