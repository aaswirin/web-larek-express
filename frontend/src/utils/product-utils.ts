/**
 * Модуль для функций
 */

/**
 * Разбить число на триады
 * @param num - число
 */
export function addSpacesToNumber(num: number) {
	return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/**
 * Падежометр для синапсов
 * @param price - цена или null
 */
export function convertPriceToString(price: number | null): string {
    let stringPrice: string = '';

    if (!price) {
        stringPrice = `Бесценно`;
    } else {
        stringPrice = addSpacesToNumber(price);

        // Падежометр
        const remains: number = price % 10;
        let text: string;
        if (price > 10 && price < 15) text = 'синапсов';
        else if (remains === 1) text = 'синапс';
        else if (remains > 1 && remains < 5) text = 'синапса';
        else text = 'синапсов';

        stringPrice = `${stringPrice} ${text}`;
    }

    return stringPrice;
}
