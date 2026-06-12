const fs = require('fs');
const pangu = require('pangu');

const file = 'texts/zh_CN.lang';

let text = fs.readFileSync(file, 'utf8');

const protectedItems = [];

/**
 * 保护特殊标记
 */
function protect(regex) {
    text = text.replace(regex, match => {
        const id = protectedItems.length;
        protectedItems.push(match);
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
protect(/§./g);


/**
 * 执行 pangu
 */
text = pangu.spacing(text);

/**
 * 恢复所有保护内容
 */
text = text.replace(/⟦P(\d+)⟧/g, (_, index) => {
    return protectedItems[Number(index)];
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