hero: {
    type: "image",
        url: product.image || 'https://via.placeholder.com/300',
            size: "full",
                aspectRatio: "1:1",
                    aspectMode: "cover",
                        action: {
        type: "uri",
            label: "View Product",
                uri: product.link
    }
},
body: {
    type: "box",
        layout: "vertical",
            contents: [
                {
                    type: "text",
                    text: product.title.substring(0, 40) + '...',
                    weight: "bold",
                    size: "xs",
                    wrap: true,
                    maxLines: 2
                },
                {
                    type: "box",
                    layout: "baseline",
                    contents: [
                        {
                            type: "text",
                            text: `฿${product.price.toLocaleString()}`,
                            color: "#ff5551",
                            size: "md",
                            weight: "bold",
                            flex: 0
                        },
                        {
                            type: "text",
                            text: product.sold > 0 ? `ขายแล้ว ${formatSold(product.sold)}` : '',
                            color: "#aaaaaa",
                            size: "xxs",
                            align: "end",
                            flex: 1
                        }
                    ],
                    margin: "md"
                }
            ],
                paddingAll: "sm"
},
footer: {
    type: "box",
        layout: "vertical",
            contents: [
                {
                    type: "button",
                    style: "primary",
                    color: "#101988",
                    height: "sm",
                    action: {
                        type: "uri",
                        label: "ซื้อเลย 👉",
                        uri: product.link
                    }
                }
            ],
                paddingAll: "sm"
}
    };
}

function formatSold(num: number): string {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}