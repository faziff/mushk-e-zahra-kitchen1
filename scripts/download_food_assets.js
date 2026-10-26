import fs from 'fs';
import path from 'path';
import https from 'https';

const TARGET_DIR = path.resolve(process.cwd(), 'public/assets/food');
if (!fs.existsSync(TARGET_DIR)) {
  fs.mkdirSync(TARGET_DIR, { recursive: true });
}

// 27 distinct authentic food dishes covering all 25 prompt items
const FOOD_ITEMS = [
  // Signature Kabab
  {
    filename: 'shami-kabab.jpg',
    url: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chapli-kabab.jpg',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'seekh-kabab.jpg',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&h=600&q=80',
  },

  // Desi Handi
  {
    filename: 'mix-choor.jpg',
    url: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'anday-keelay.jpg',
    url: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'achaar-gosht.jpg',
    url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&h=600&q=80',
  },

  // Rice Kitchen
  {
    filename: 'chicken-rice.jpg',
    url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-pistasal-biryani.jpg',
    url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-bombay-biryani.jpg',
    url: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-shahi-biryani.jpg',
    url: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-yakhni-pulao.jpg',
    url: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=600&h=600&q=80',
  },

  // Frozen Kitchen
  {
    filename: 'frozen-paratha.jpg',
    url: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'aloo-paratha.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'frozen-shami-kabab.jpg',
    url: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'frozen-chapli-kabab.jpg',
    url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'frozen-chicken-samosa.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=600&q=80',
  },

  // Burger & Crunch Corner
  {
    filename: 'beef-anda-shami-burger.jpg',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'anda-shami-burger.jpg',
    url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'fresh-fries.jpg',
    url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'crispy-nuggets.jpg',
    url: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-macaroni-half.jpg',
    url: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1621996346565-e3adc644d946?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-macaroni-full.jpg',
    url: 'https://images.unsplash.com/photo-1621996346565-e3adc644d946?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&h=600&q=80',
  },

  // Snack Attack
  {
    filename: 'malai-boti-samosa.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'pizza-samosa.jpg',
    url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'mix-vegetable-samosa.jpg',
    url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'mozzart-samosa.jpg',
    url: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=600&q=80',
  },
  {
    filename: 'chicken-samosa.jpg',
    url: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&h=600&q=80',
    fallback: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&h=600&q=80',
  },
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          const stats = fs.statSync(destPath);
          if (stats.size > 2000) {
            resolve(stats.size);
          } else {
            reject(new Error(`File too small: ${stats.size} bytes`));
          }
        });
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Starting download of ${FOOD_ITEMS.length} food assets...`);
  let successCount = 0;
  for (const item of FOOD_ITEMS) {
    const dest = path.join(TARGET_DIR, item.filename);
    try {
      const bytes = await downloadFile(item.url, dest);
      console.log(`✓ Saved ${item.filename} (${Math.round(bytes / 1024)} KB)`);
      successCount++;
    } catch (err) {
      console.warn(`! Primary failed for ${item.filename}, trying fallback: ${err.message}`);
      try {
        const bytes = await downloadFile(item.fallback, dest);
        console.log(`✓ Saved ${item.filename} from fallback (${Math.round(bytes / 1024)} KB)`);
        successCount++;
      } catch (fErr) {
        console.error(`✗ Failed ${item.filename}: ${fErr.message}`);
      }
    }
  }
  console.log(`Done. Successfully downloaded ${successCount}/${FOOD_ITEMS.length} food images.`);
}

main();
