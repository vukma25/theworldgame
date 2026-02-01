import { Facebook, X, Instagram, LinkedIn, Link } from "@mui/icons-material"

export const socials = {
    "facebook": {
        icon: <Facebook sx={{ fill: "gray" }} />,
        regex: /^(https?:\/\/)?(www\.)?(facebook|fb)\.(com|me)\/[a-zA-Z0-9.]{1,}$/i,
        helper: "Should be 'https://facebook.com/:id'",
        validate: (url) => {
            const basicPattern = /^(https?:\/\/)?(www\.)?(facebook|fb)\.(com|me)\/[a-zA-Z0-9.]{1,}$/i;
            if (!basicPattern.test(url)) return false;

            // Thêm các kiểm tra bảo mật
            const dangerousPatterns = [
                /javascript:/i,
                /data:/i,
                /vbscript:/i,
                /onclick|onload|onerror/i,
                /<script|<iframe|<object/i,
                /%3C|%3E|%22|%27|%28|%29/i // Các ký tự HTML encoded
            ];

            return !dangerousPatterns.some(pattern => pattern.test(url));
        }
    },
    "x": {
        icon: <X sx={{ fill: "gray" }} />,
        regex: /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/@?[a-zA-Z0-9_]{1,15}$/i,
        helper: "Should be 'https://(x|twitter).com/:id",
        validate: (url) => {
            const basicPattern = /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/@?[a-zA-Z0-9_]{1,15}$/i;
            if (!basicPattern.test(url)) return false;

            const dangerousPatterns = [
                /javascript:/i,
                /\.exe$|\.bat$|\.sh$|\.php\?/i,
                /[\x00-\x1F\x7F<>"'`]/ // Ký tự điều khiển và HTML đặc biệt
            ];

            return !dangerousPatterns.some(pattern => pattern.test(url));
        }
    },
    "instagram": {
        icon: <Instagram sx={{ fill: "gray" }} />,
        regex: /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}$/i,
        helper: "Should be 'https://instagram.com/:id",
        validate: (url) => {
            const basicPattern = /^(https?:\/\/)?(www\.)?instagram\.com\/[a-zA-Z0-9._]{1,30}$/i;
            if (!basicPattern.test(url)) return false;

            const dangerousPatterns = [
                /\.(js|jar|exe|dll|bat|cmd|ps1|sh)$/i,
                /[\x00-\x1F\x7F<>"']/,
                /%00|%0a|%0d/i // Null bytes, new lines
            ];

            return !dangerousPatterns.some(pattern => pattern.test(url));
        }
    },
    "linkedin": {
        icon: <LinkedIn sx={{ fill: "gray" }} />,
        regex: /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]{1,100}$/i,
        helper: "Should be 'https://linkedin.com/(in|company)/:id",
        validate: (url) => {
            const basicPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]{1,100}$/i;
            if (!basicPattern.test(url)) return false;

            const dangerousPatterns = [
                /\.(php|asp|aspx|jsp|cgi|pl)\?/i,
                /[<>"'`]/,
                /%3C|%3E|%22|%27/i
            ];

            return !dangerousPatterns.some(pattern => pattern.test(url));
        }
    },
    "other": {
        icon: <Link sx={{ fill: "gray" }} />,
        regex: /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i,
        helper: "Example 'https://example.com",
        validate: (url) => {
            // Regex cơ bản cho URL hợp lệ
            const urlPattern = /^(https?:\/\/)[\w.-]+(?:\.[\w.-]+)+[\w\-._~:/?#[\]@!$&'()*+,;=]*$/i;
            if (!urlPattern.test(url)) return false;

            // Danh sách domain nguy hiểm (có thể mở rộng)
            const dangerousDomains = [
                'malicious-site.com',
                'phishing-site.net',
                'evil-domain.org'
                // Thêm các domain độc hại khác tại đây
            ];

            // Kiểm tra domain
            try {
                const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
                if (dangerousDomains.some(d => domain.includes(d))) {
                    return false;
                }
            } catch {
                return false;
            }

            // Kiểm tra các mẫu nguy hiểm
            const dangerousPatterns = [
                /javascript:/i,
                /data:/i,
                /vbscript:/i,
                /[\x00-\x1F\x7F<>"'`]/, // Ký tự điều khiển và HTML
                /\.(exe|bat|sh|js|jar|dll|cmd|ps1|scr|msi)$/i, // File thực thi
                /\.(php|asp|aspx|jsp|cgi|pl)\?.*=/i, // Script với parameters
                /union.*select|select.*from|insert.*into|delete.*from|drop.*table/i, // SQL injection
                /<script|<iframe|<object|<embed|<form|<input/i, // HTML injection
                /onclick|onload|onerror|onmouseover/i, // JavaScript events
                /eval\(|alert\(|document\.cookie/i, // JavaScript dangerous functions
                /%3C|%3E|%22|%27|%28|%29|%2F%2F/i, // URL encoded dangerous chars
                /\/\.\.\//, // Directory traversal
                /null|undefined|NaN/i,
                /[\u202E\u200B\u200C\u200D\uFEFF]/ // Unicode invisible/tricky characters
            ];

            // Kiểm tra độ dài URL (tránh buffer overflow)
            if (url.length > 2048) return false;

            return !dangerousPatterns.some(pattern => pattern.test(url));
        }
    }
};