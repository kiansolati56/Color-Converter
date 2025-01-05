    // Helper functions for conversions
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    function rgbToHex(r, g, b) {
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }

    function rgbToHsl(r, g, b) {
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b),
            min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    function hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l; // achromatic
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function hslToHex(h, s, l) {
        const {
            r,
            g,
            b
        } = hslToRgb(h, s, l);
        return rgbToHex(r, g, b);
    }

    function convertColor(input) {
        let hex = null,
            rgb = null,
            hsl = null;

        if (input.startsWith('#')) {
            // HEX input
            hex = input;
            const rgbObj = hexToRgb(hex);
            if (rgbObj) {
                rgb = `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})`;
                const hslObj = rgbToHsl(rgbObj.r, rgbObj.g, rgbObj.b);
                hsl = `hsl(${hslObj.h},${hslObj.s}%,${hslObj.l}%)`;
            }
        } else if (input.startsWith('rgb')) {
            // RGB input
            const rgbMatch = input.match(/rgb\((\d+),(\d+),(\d+)\)/);
            if (rgbMatch) {
                const r = parseInt(rgbMatch[1]),
                    g = parseInt(rgbMatch[2]),
                    b = parseInt(rgbMatch[3]);
                rgb = input;
                hex = rgbToHex(r, g, b);
                const hslObj = rgbToHsl(r, g, b);
                hsl = `hsl(${hslObj.h},${hslObj.s}%,${hslObj.l}%)`;
            }
        } else if (input.startsWith('hsl')) {
            // HSL input
            const hslMatch = input.match(/hsl\((\d+),(\d+)%,(\d+)%\)/);
            if (hslMatch) {
                const h = parseInt(hslMatch[1]),
                    s = parseInt(hslMatch[2]),
                    l = parseInt(hslMatch[3]);
                hsl = input;
                const rgbObj = hslToRgb(h, s, l);
                rgb = `rgb(${rgbObj.r},${rgbObj.g},${rgbObj.b})`;
                hex = rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b);
            }
        }

        return {
            hex,
            rgb,
            hsl
        };
    }

    // Event listeners
    document.getElementById('convertBtn').addEventListener('click', () => {
        const input = document.getElementById('colorInput').value.trim();
        const {
            hex,
            rgb,
            hsl
        } = convertColor(input);

        document.getElementById('hexResult').textContent = hex || 'Invalid Input';
        document.getElementById('rgbResult').textContent = rgb || 'Invalid Input';
        document.getElementById('hslResult').textContent = hsl || 'Invalid Input';

        document.getElementById('results').classList.remove('hidden');
    });