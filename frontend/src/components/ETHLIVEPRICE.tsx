const ETHLIVEPRICE = async (apiKey) => {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=PKR&apiKey=${apiKey}`);
        if (!response.ok) {
        throw new Error('Failed to fetch ETH price');
      }
      const data = await response.json();
   
      return data.ethereum.pkr;
    } catch (error) {
      console.error('Error fetching ETH price:', error);
      return null;
    }
  };
  
  export default ETHLIVEPRICE;