/**
 * PaymentService - Isolated mock payment processing
 * 
 * No real payment is ever processed. No card data is stored or transmitted.
 * 
 * Interface: processPayment(orderData) -> Promise<PaymentResult>
 */
const PaymentService = (() => {

  function generateOrderId() {
    const rand = Array.from({ length: 8 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    return `ORD-${rand}`;
  }

  function generateTransactionId() {
    const rand = Array.from({ length: 12 }, () =>
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 36)]
    ).join('');
    return `TXN-${rand}`;
  }

  // Valid cards for testing
  const VALID_CARDS = [
    { number: '4782780001944142', expiry: '03/27', cvv: '741' },
    { number: '4649510001641932', expiry: '04/31', cvv: '039' },
  ];

  // Dummy cards sent in email on successful payment
  const DUMMY_CARDS = [
    { name: 'Sophia Garcia',      number: '4838822580363657', cvv: '800', expiry: '10/29' },
    { name: 'David Johnson',      number: '4868759507542472', cvv: '515', expiry: '05/28' },
    { name: 'David Lopez',        number: '4703206328209777', cvv: '250', expiry: '05/30' },
    { name: 'William Williams',   number: '4895435010323975', cvv: '429', expiry: '02/26' },
    { name: 'Charlotte Davis',    number: '4558115448390208', cvv: '493', expiry: '04/28' },
    { name: 'Sophia Lopez',       number: '4192700349688288', cvv: '512', expiry: '12/30' },
    { name: 'Robert Johnson',     number: '4481620754564637', cvv: '315', expiry: '03/28' },
    { name: 'Sarah Gonzalez',     number: '4618043578056873', cvv: '545', expiry: '05/27' },
    { name: 'John Wilson',        number: '4566124382065193', cvv: '322', expiry: '08/29' },
    { name: 'Olivia Jones',       number: '4973530221428428', cvv: '891', expiry: '08/30' },
    { name: 'Olivia Smith',       number: '4474910623501054', cvv: '613', expiry: '12/28' },
    { name: 'Michael Smith',      number: '4642086547315898', cvv: '771', expiry: '08/27' },
    { name: 'Jane Garcia',        number: '4998753826348188', cvv: '449', expiry: '07/27' },
    { name: 'Mia Williams',       number: '4910570670482785', cvv: '919', expiry: '03/29' },
    { name: 'Olivia Davis',       number: '4211582949065582', cvv: '896', expiry: '12/26' },
    { name: 'Richard Gonzalez',   number: '4854793882806859', cvv: '051', expiry: '10/28' },
    { name: 'Joseph Garcia',      number: '4868879820133649', cvv: '247', expiry: '01/30' },
    { name: 'Sarah Jones',        number: '4195114059234832', cvv: '594', expiry: '06/30' },
    { name: 'Jane Martinez',      number: '4421236396583433', cvv: '125', expiry: '01/29' },
    { name: 'Richard Brown',      number: '4142352198238047', cvv: '439', expiry: '11/29' },
    { name: 'Emma Thomas',        number: '4893900700178863', cvv: '595', expiry: '10/28' },
    { name: 'John Rodriguez',     number: '4490104406972449', cvv: '150', expiry: '02/28' },
    { name: 'Sarah Gonzalez',     number: '4104836819076900', cvv: '342', expiry: '10/29' },
    { name: 'Mia Garcia',         number: '4507268616657851', cvv: '867', expiry: '02/30' },
    { name: 'William Miller',     number: '4622045539559436', cvv: '782', expiry: '12/26' },
    { name: 'Charlotte Davis',    number: '4270535192956197', cvv: '058', expiry: '03/27' },
    { name: 'Charlotte Anderson', number: '4851687558954600', cvv: '305', expiry: '06/28' },
    { name: 'Emma Williams',      number: '4057545283709558', cvv: '930', expiry: '06/27' },
    { name: 'Jane Thomas',        number: '4729937467116974', cvv: '957', expiry: '08/27' },
    { name: 'John Thomas',        number: '4183355694851737', cvv: '750', expiry: '10/28' },
    { name: 'Robert Anderson',    number: '4943615181687074', cvv: '028', expiry: '10/29' },
    { name: 'Isabella Miller',    number: '4414790855225032', cvv: '331', expiry: '08/26' },
    { name: 'Mia Wilson',         number: '4108274962771534', cvv: '311', expiry: '11/26' },
    { name: 'Michael Anderson',   number: '4264533427023865', cvv: '688', expiry: '05/27' },
    { name: 'Michael Johnson',    number: '4844360561634501', cvv: '694', expiry: '01/28' },
    { name: 'Olivia Williams',    number: '4060888038533777', cvv: '449', expiry: '09/27' },
    { name: 'Joseph Smith',       number: '4345148465205971', cvv: '806', expiry: '04/26' },
    { name: 'John Davis',         number: '4290117731575317', cvv: '583', expiry: '04/30' },
    { name: 'Michael Miller',     number: '4452591168547772', cvv: '126', expiry: '04/30' },
    { name: 'James Hernandez',    number: '4316799130645407', cvv: '650', expiry: '01/30' },
  ];

  function getRandomDummyCards(count) {
    const pool = [...DUMMY_CARDS];
    const result = [];
    for (let i = 0; i < count; i++) {
      if (pool.length === 0) pool.push(...DUMMY_CARDS);
      const idx = Math.floor(Math.random() * pool.length);
      result.push(pool.splice(idx, 1)[0]);
    }
    return result;
  }

  /**
   * Process a simulated payment
   * @param {Object} orderData - { items, total, card_number, card_expiry, card_cvv, payment_method }
   * @returns {Promise<Object>}
   */
  async function processPayment(orderData) {
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const cardNum = (orderData.card_number || '').replace(/\s/g, '');
    const cardExp = (orderData.card_expiry || '').replace(/\s/g, '');
    const cardCvv = (orderData.card_cvv || '').trim();

    const isValid = VALID_CARDS.some(c => cardNum === c.number && cardExp === c.expiry && cardCvv === c.cvv);

    if (!isValid) {
      return {
        success: false,
        error: 'Payment failed. Please try another payment method.'
      };
    }

    // Generate one random dummy card per purchased card (total quantity)
    const totalCount = (orderData.items || []).reduce((sum, it) => sum + (Number(it.quantity) || 0), 0);
    const dummyCards = getRandomDummyCards(totalCount);

    const result = {
      success: true,
      order_id: generateOrderId(),
      transaction_id: generateTransactionId(),
      timestamp: new Date().toISOString(),
      dummy_cards: dummyCards
    };

    const orders = JSON.parse(localStorage.getItem('cardmarket_orders') || '[]');
    orders.push({ ...result, items: orderData.items, total: orderData.total });
    localStorage.setItem('cardmarket_orders', JSON.stringify(orders));

    return result;
  }

  return { processPayment };

})();
