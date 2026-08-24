import { createClient } from 'redis';

class Redis {
    constructor() {
        this.client = null
    }

    setRedisClient(client) {
        this.client = client
    }

    getRedisClient() {
        return this.client
    }

    async connect() {
        this.client = createClient({
            url: `${process.env.NODE_ENV === "production" ? process.env.REDIS_URL : 'redis://localhost:6379'}`,
            socket: {
                reconnectStrategy: (retries) => {
                    return Math.min(retries * 100, 3000);
                }
            }
        })

        this.client.on('connect', () => { console.log("Đang kết nối tới redis server...") })
        this.client.on('ready', () => { console.log("Kết nối thành công tới redis server") })
        this.client.on('error', (err) => { console.error("Đã xảy ra lỗi", err) })
        await this.client.connect()
    }

    async disconnect() {
        if (this.client) {
            await this.client.quit();
            this.client = null;
        }
    }

}

const redis = new Redis()
export default redis
