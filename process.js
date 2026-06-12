const fs = require('fs');
const pangu = require('pangu');

const file = 'texts/zh_CN.lang';

let text = fs.readFileSync(file, 'utf8');

const protectedItems = [];



/**
 * 保护但视为英文
 */
function protect(regex) {
    text = text.replace(regex, match => {
        const id = protectedItems.length;
        protectedItems.push(match);
        return `Protected${id}`;
    });
}

// 我真的是疯了
// 这个早一天的生日礼物，你喜欢吗
const protectedStrictItems = [];

/**
 * 保护且防止被处理
 */
function protectStrict(regex) {
    text = text.replace(regex, match => {
        const id = protectedStrictItems.length;
        protectedStrictItems.push(match);

        const sectionPos = match.indexOf('§');

        if (sectionPos > 0) {
            const prevChar = match[sectionPos - 1];

            // 中文
            if (/[\u4E00-\u9FFF]/.test(prevChar)) {
                return `⟦P${id}⟧桀夜我喜欢你`;
            }

            // 英文
            if (/[A-Za-z]/.test(prevChar)) {
                return `⟦P${id}⟧ILoveUFromLuoYunXi`;
            }
        }

        return `⟦P${id}⟧`;
    });
}


// %s
// %d
// %1$s
// %2$d
protect(/%\d*\$?[a-zA-Z]/g);

// :tip_virtual_button_action_build_or_use:
// 他妈这里有个蛋
protect(/:[a-zA-Z0-9_.-]+:/g);


// §a
// §b
// §l
protectStrict(/§./g);


/**
 * 执行 pangu
 */
text = pangu.spacingText(text);

/**
 * 恢复所有保护内容
 */
text = text.replace(/Protected(\d+)/g, (_, index) => {
    return protectedItems[Number(index)];
});

// 我真几把疯了
text = text.replace(
    /⟦P(\d+)⟧(?:桀夜我喜欢你|ILoveUFromLuoYunXi)?/g,
    (_, index) => protectedStrictItems[Number(index)]
);

/**
 * 额外修正
 */

// key = value → key=value
text = text.replace(/\s+=\s+/g, '=');

/**
 * 写回文件
 */
fs.writeFileSync(file, text, 'utf8');

console.log(`Processed ${file}`);