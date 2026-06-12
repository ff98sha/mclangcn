const fs = require('fs');
const pangu = require('pangu');

const file = 'texts/zh_CN.lang';

let text = fs.readFileSync(file, 'utf8');

const protectedItems = [];

const protectedStrictItems = [];


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

/**
 * 保护且防止被处理
 */
function protectStrict(regex) {
    text = text.replace(regex, match => {
        const id = protectedStrictItems.length;
        protectedStrictItems.push(match);
        return `⟦P${id}⟧`;
    });
}


// %s
// %d
// %1$s
// %2$d
protect(/%\d*\$?[a-zA-Z]/g);

// :tip_virtual_button_action_build_or_use:
protect(/:[a-zA-Z0-9_-]+:/g);


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

text = text.replace(/⟦P(\d+)⟧/g, (_, index) => {
    return protectedStrictItems[Number(index)];
});

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