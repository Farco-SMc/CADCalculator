// Helper function to reset the calculated total display and hide the results container
function resetCalculation() {
  document.getElementById('collectionTotal').textContent = "£0.00";
  document.getElementById('assessmentTotal').textContent = "£0.00";
  document.getElementById('combinedTotal').textContent = "£0.00";
  document.getElementById('creditTotal').textContent = "£0.00";
  document.getElementById('resultMessage').style.display = "none";
}

// Helper Functions to Reset Sections
function resetInsuranceFields() {
  // Hide insurance-related sections
  document.getElementById('assessmentSection').classList.add('hidden');
  document.getElementById('supplierCreditAdjustment').classList.add('hidden');
}

function resetPrivateFields() {
  // Reset or clear private-specific dynamic sections if necessary.
}

// POA modal functions
function showPriceModal(message) {
  document.getElementById('modalText').innerHTML = message;
  document.getElementById('priceModal').style.display = "flex";
}
function closePriceModal() {
  document.getElementById('priceModal').style.display = "none";
}
// FAQ modal functions
function showFaqModal() {
  document.getElementById('faqModal').style.display = "flex";
}
function closeFaqModal() {
  document.getElementById('faqModal').style.display = "none";
}

// Toggle client type sections with reset functionality
const privateCheckbox = document.getElementById('clientPrivate');
const insuranceCheckbox = document.getElementById('clientInsurance');

privateCheckbox.addEventListener('change', function() {
  if (this.checked) {
    insuranceCheckbox.checked = false;
    document.getElementById('privateSection').classList.remove('hidden');
    document.getElementById('insuranceSection').classList.add('hidden');
    resetInsuranceFields(); // Hide insurance-specific sections
    resetCalculation();     // Reset the calculated totals and hide results
  } else {
    document.getElementById('privateSection').classList.add('hidden');
  }
});

insuranceCheckbox.addEventListener('change', function() {
  if (this.checked) {
    privateCheckbox.checked = false;
    document.getElementById('insuranceSection').classList.remove('hidden');
    document.getElementById('privateSection').classList.add('hidden');
    resetPrivateFields(); // Reset private-specific sections if necessary
    checkInsuranceCoverage();
    resetCalculation();   // Reset the calculated totals and hide results
  } else {
    document.getElementById('insuranceSection').classList.add('hidden');
  }
});

// Show crate options for private branch
document.getElementsByName('privateCrateRequired').forEach(radio => {
  radio.addEventListener('change', function() {
    const crateOptions = document.getElementById('privateCrateOptions');
    if (this.value === "yes") {
      crateOptions.classList.remove('hidden');
    } else {
      crateOptions.classList.add('hidden');
    }
  });
});

// Display crate count field only if item count is more than 1
document.getElementById('privateItemCount').addEventListener('change', function() {
  const crateCountLabel = document.getElementById('crateCountLabel');
  if (parseInt(this.value, 10) > 1) {
    crateCountLabel.classList.remove('hidden');
  } else {
    crateCountLabel.classList.add('hidden');
  }
});

// Dynamic item count inputs for Private Client branch (if needed)
document.querySelectorAll('input[name="privateItemType"]').forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const container = document.getElementById('privateItemCounts');
    if (document.querySelectorAll('input[name="privateItemType"]:checked').length > 0) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
    if (this.checked) {
      if (!document.getElementById('private_count_' + this.value)) {
        let div = document.createElement('div');
        div.id = 'private_div_' + this.value;
        div.innerHTML = '<label>' + this.value.charAt(0).toUpperCase() + this.value.slice(1) + ' count: <input type="number" id="private_count_' + this.value + '" min="1" value="1"></label>';
        container.appendChild(div);
      }
    } else {
      let divToRemove = document.getElementById('private_div_' + this.value);
      if (divToRemove) {
        container.removeChild(divToRemove);
      }
    }
  });
});

// Dynamic item count inputs for Insurance branch
document.querySelectorAll('input[name="insuranceItemType"]').forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const container = document.getElementById('insuranceItemCounts');
    if (document.querySelectorAll('input[name="insuranceItemType"]:checked').length > 0) {
      container.classList.remove('hidden');
    } else {
      container.classList.add('hidden');
    }
    if (this.checked) {
      if (!document.getElementById('count_' + this.value)) {
        let div = document.createElement('div');
        div.id = 'div_' + this.value;
        let labelText;
        if (this.value === "sentimental") {
          labelText = "Sentimental pieces count:";
        } else if (this.value === "work_on_paper") {
          labelText = "Work on Paper count:";
        } else {
          labelText = this.value.charAt(0).toUpperCase() + this.value.slice(1) + " count:";
        }
        div.innerHTML = '<label>' + labelText + ' <input type="number" id="count_' + this.value + '" min="1" value="1"></label>';
        container.appendChild(div);
      }
    } else {
      let divToRemove = document.getElementById('div_' + this.value);
      if (divToRemove) {
        container.removeChild(divToRemove);
      }
    }
  });
});

// Insurance branch: Toggle collection route details and hide assessment & supplier credit if dedicated collection
document.getElementsByName('insuranceNormalRoute').forEach(radio => {
  radio.addEventListener('change', function() {
    if (this.value === 'no') {
      document.getElementById('insuranceDedicated').classList.remove('hidden');
      document.getElementById('insuranceStandardDetails').classList.add('hidden');
      document.getElementById('insuranceItemDetails').classList.add('hidden');
      // Hide assessment and supplier credit sections when a dedicated collection is needed
      document.getElementById('assessmentSection').classList.add('hidden');
      document.getElementById('supplierCreditAdjustment').classList.add('hidden');
    } else {
      document.getElementById('insuranceDedicated').classList.add('hidden');
      document.getElementById('insuranceStandardDetails').classList.remove('hidden');
      document.getElementById('insuranceItemDetails').classList.remove('hidden');
      // Reveal assessment section for standard collections
      document.getElementById('assessmentSection').classList.remove('hidden');
    }
  });
});

// Insurance coverage check
function checkInsuranceCoverage() {
  const insuranceTotalValue = parseFloat(document.getElementById('insuranceTotalValueInput').value);
  const insuranceExtended = document.querySelector('input[name="insuranceExtended"]:checked');
  if (isNaN(insuranceTotalValue) || !insuranceExtended) return;
  
  if (insuranceExtended.value === "yes" && insuranceTotalValue <= 50000) {
    document.getElementById('insuranceRest').classList.remove('hidden');
  } else {
    document.getElementById('insuranceRest').classList.add('hidden');
    if (insuranceExtended.value === "no") {
      showPriceModal("POA – please speak to Chris, Anna or Julia for a cost to determine our insurance coverage");
    } else if (insuranceExtended.value === "yes" && insuranceTotalValue > 50000) {
      showPriceModal("POA – please speak to Chris, Anna or Julia for a cost owing to high collection value");
    }
  }
}

document.getElementById("insuranceTotalValueInput").addEventListener("change", checkInsuranceCoverage);
document.querySelectorAll('input[name="insuranceExtended"]').forEach(radio => {
  radio.addEventListener("change", checkInsuranceCoverage);
});

// Mapping supplier IDs to credit percentages.
const supplierCredits = {
  na: 0,
  crawford: 0.10,
  criterion: 0.00,
  dcp_home_counties: 0.00,
  disastercare: 0.00,
  esteem: 0.00,
  independent_restoration: 0.00,
  mclarens: 0.00,
  northern_restoration: 0.00,
  prime: 0.00,
  rainbow_cheshire: 0.20,
  rainbow_liverpool: 0.20,
  rainbow_morecambe: 0.20,
  rainbow_somerset: 0.10,
  rainbow_sw_london: 0.10,
  revival_east_anglia: 0.10,
  revival_huddersfield: 0.00,
  revival_manchester: 0.10,
  revival_north_london: 0.10,
  revival_southern: 0.15,
  revival_sw_london: 0.10,
  revival_thames_valley: 0.10,
  woodgate_clark: 0.00,
  not_on_list: 0
};

// Calculate Total function for Private and Insurance branches
function calculateTotal() {
  let total = 0;
  let priceOnAsking = false;
  
  // PRIVATE CLIENT CALCULATIONS
  if (privateCheckbox.checked) {
    const totalValue = document.getElementById('privateTotalValue').value;
    const numItems = parseInt(document.getElementById('privateItemCount').value, 10);
    const itemTypeElem = document.querySelector('input[name="privateItemType"]:checked');
    if (!totalValue || isNaN(numItems) || numItems < 1 || !itemTypeElem) {
      alert("Please complete all Private Client fields.");
      return;
    }
    if (totalValue === "0-10000" && numItems > 15) {
      showPriceModal("POA – please speak to Chris, Anna or Julia for a cost owing to high number of items");
      return;
    }
    if (numItems <= 3) {
      switch(totalValue) {
        case "0-10000":
          total += 90;
          break;
        case "10001-20000":
          total += 120;
          break;
        case "20001-30000":
          total += 160;
          break;
        case "30001-40000":
          total += 210;
          break;
        case "40001-50000":
          total += 270;
          break;
        case "50000plus":
          priceOnAsking = true;
          break;
      }
    } else {
      if (totalValue === "0-10000") {
        total += 90 + 25 * (numItems - 3);
      } else {
        priceOnAsking = true;
      }
    }
    if (priceOnAsking) {
      if (totalValue === "50000plus" && numItems <= 3) {
        showPriceModal("POA – please speak to Chris, Anna or Julia for a cost owing to item value");
      } else if (numItems > 3 && totalValue !== "0-10000") {
        showPriceModal("POA – please speak to Chris, Anna or Julia for a cost owing to number of high value items");
      }
      return;
    }
    const secondPersonElem = document.querySelector('input[name="privateSecondPerson"]:checked');
    const secondPerson = secondPersonElem ? secondPersonElem.value : "no";
    if (secondPerson === "advisable") {
      total += 250;
    } else if (secondPerson === "essential") {
      total += 500;
    }
    const crateRequiredElem = document.querySelector('input[name="privateCrateRequired"]:checked');
    if (crateRequiredElem && crateRequiredElem.value === "yes") {
      const crateTypeElem = document.querySelector('input[name="privateCrateType"]:checked');
      // Get number of crates (default to 1 if not specified)
      let inputCrateCount = 1;
      if (document.getElementById('privateCrateCount')) {
        inputCrateCount = parseInt(document.getElementById('privateCrateCount').value, 10) || 1;
        if (inputCrateCount > numItems) {
          showPriceModal("number of crates entered is total number of items");
        }
      }
      let crateCount = Math.min(inputCrateCount, numItems);
      if (crateTypeElem) {
        if (crateTypeElem.value === "inhouse") {
          if (totalValue === "0-10000" || totalValue === "10001-20000" || totalValue === "20001-30000") {
            total += 180 * crateCount;
          } else if (totalValue === "30001-40000" || totalValue === "40001-50000") {
            total += 240 * crateCount;
          } else if (totalValue === "50000plus") {
            priceOnAsking = true;
          }
        } else if (crateTypeElem.value === "bespoke") {
          priceOnAsking = true;
        }
      }
      if (priceOnAsking) {
        showPriceModal("POA – please speak to Chris, Anna or Julia for a cost for a bespoke crate");
        return;
      }
    }
    const tripTypeElem = document.querySelector('input[name="privateTripType"]:checked');
    if (tripTypeElem && tripTypeElem.value === "roundtrip") {
      total *= 2;
    }
    
    // Update results for Private branch:
    document.getElementById('collectionTotal').textContent = "£" + total.toFixed(2);
    
    // Hide the assessment, combined and supplier credit rows for private clients
    document.getElementById('assessmentTotal').parentNode.style.display = "none";
    document.getElementById('combinedTotal').parentNode.style.display = "none";
    document.getElementById('creditTotal').parentNode.style.display = "none";
    
    document.getElementById('resultMessage').style.display = "block";
  }
  // INSURANCE CALCULATIONS
  else if (insuranceCheckbox.checked) {
    let collectionCost = 0;
    const insuranceSurge = document.querySelector('input[name="insuranceSurge"]:checked');
    if (insuranceSurge && insuranceSurge.value === "yes") {
      collectionCost += 400;
    }
    const insuranceNormalRoute = document.querySelector('input[name="insuranceNormalRoute"]:checked');
    if (insuranceNormalRoute) {
      if (insuranceNormalRoute.value === "no") {
        // Dedicated collection – only display Collection/Delivery Total
        const numVans = parseFloat(document.getElementById('insuranceNumVans').value) || 0;
        const numPeople = parseFloat(document.getElementById('insuranceNumPeople').value) || 0;
        collectionCost += (numVans * 1000) + (numPeople * 500);
        document.getElementById('collectionTotal').textContent = "£" + collectionCost.toFixed(2);
        // Hide extra rows for dedicated collections
        document.getElementById('assessmentTotal').parentNode.style.display = "none";
        document.getElementById('combinedTotal').parentNode.style.display = "none";
        document.getElementById('creditTotal').parentNode.style.display = "none";
        // Also ensure assessment and supplier credit sections remain hidden
        document.getElementById('assessmentSection').classList.add('hidden');
        document.getElementById('supplierCreditAdjustment').classList.add('hidden');
        document.getElementById('resultMessage').style.display = "block";
      } else {
        // Standard route – full breakdown
        // Ensure extra rows are visible
        document.getElementById('assessmentTotal').parentNode.style.display = "flex";
        document.getElementById('combinedTotal').parentNode.style.display = "flex";
        document.getElementById('creditTotal').parentNode.style.display = "flex";
        collectionCost += 90;
        const insuranceSecondPerson = document.querySelector('input[name="insuranceSecondPerson"]:checked');
        if (insuranceSecondPerson) {
          if (insuranceSecondPerson.value === "advisable") {
            collectionCost += 250;
          } else if (insuranceSecondPerson.value === "essential") {
            collectionCost += 500;
          }
        }
        let additionalCost = 0;
        let multipliers = [];
        document.querySelectorAll('input[name="insuranceItemType"]:checked').forEach(function(checkbox) {
          let countInput = document.getElementById('count_' + checkbox.value);
          let count = parseFloat(countInput.value) || 0;
          if (checkbox.value === "sentimental") {
            if (count > 3) {
              showPriceModal("POA – please speak to Chris, Anna or Julia for a cost to cover boxes of sentimental items");
              return;
            }
          } else {
            let multiplier;
            const insuranceSecondPerson = document.querySelector('input[name="insuranceSecondPerson"]:checked');
            if (insuranceSecondPerson && (insuranceSecondPerson.value === "advisable" || insuranceSecondPerson.value === "essential")) {
              multiplier = 25;
            } else {
              multiplier = (checkbox.value === "furniture") ? 20 : 10;
            }
            additionalCost += count * multiplier;
            if (count > 0) { multipliers.push(multiplier); }
          }
        });
        if (multipliers.length > 0) {
          let freeDiscount = Math.min(...multipliers);
          additionalCost -= freeDiscount;
        }
        collectionCost += additionalCost;
        document.getElementById('collectionTotal').textContent = "£" + collectionCost.toFixed(2);
        document.getElementById('assessmentTotal').textContent = "£0.00";
        document.getElementById('combinedTotal').textContent = "£" + collectionCost.toFixed(2);
        document.getElementById('creditTotal').textContent = "£" + collectionCost.toFixed(2);
        document.getElementById('resultMessage').style.display = "block";
      }
    }
  }
}

// Streamlined Assessment processing using a single "Proceed" button.
function processAssessment() {
  const option = document.querySelector('input[name="assessmentOption"]:checked').value;
  let assessmentCost = 0;
  if (option === "yes") {
    let flatFee = 100; // Added once for all item types
    let additional = 0;
    const totalValue = parseFloat(document.getElementById('insuranceTotalValueInput').value) || 0;
    const checkedTypes = Array.from(document.querySelectorAll('input[name="insuranceItemType"]:checked')).map(cb => cb.value);
    let isObjectsOnly = (checkedTypes.length === 1 && (checkedTypes[0] === "object" || checkedTypes[0] === "work_on_paper"));
    const types = ["painting", "work_on_paper", "object", "furniture", "sentimental"];
    types.forEach(function(type) {
      const checkbox = document.querySelector('input[name="insuranceItemType"][value="'+type+'"]');
      if (checkbox && checkbox.checked) {
        const countInput = document.getElementById('count_' + type);
        let count = parseInt(countInput.value, 10);
        if (isNaN(count) || count < 1) count = 1;
        let multiplier = 0;
        switch(type) {
          case "painting":
            multiplier = 65;
            break;
          case "work_on_paper":
            multiplier = 25;
            if (isObjectsOnly && totalValue > 10000) {
              multiplier = 65;
            }
            break;
          case "object":
            multiplier = 25;
            if (isObjectsOnly && totalValue > 10000) {
              multiplier = 65;
            }
            break;
          case "furniture":
            multiplier = 25;
            break;
          case "sentimental":
            multiplier = 25;
            break;
        }
        additional += (count - 1) * multiplier;
      }
    });
    assessmentCost = flatFee + additional;
  }
  // Get the current collection/delivery cost from the insurance calculation
  let collectionStr = document.getElementById('collectionTotal').textContent;
  let collectionCost = parseFloat(collectionStr.replace("£", "")) || 0;
  let combinedTotal = collectionCost + assessmentCost;
  document.getElementById('assessmentTotal').textContent = "£" + assessmentCost.toFixed(2);
  document.getElementById('combinedTotal').textContent = "£" + combinedTotal.toFixed(2);
  document.getElementById('creditTotal').textContent = "£" + combinedTotal.toFixed(2);
  revealSupplierCredit();
}

// Reveal Supplier Credit section
function revealSupplierCredit() {
  document.getElementById('supplierCreditAdjustment').classList.remove('hidden');
}

// Apply Supplier Credit to the full combined total
function applySupplierCredit() {
  let combinedStr = document.getElementById('combinedTotal').textContent;
  let combinedCost = parseFloat(combinedStr.replace("£", ""));
  if (isNaN(combinedCost)) {
    alert("Invalid base cost.");
    return;
  }
  const supplier = document.getElementById("supplierSelect").value;
  if (!supplier) {
    alert("Please select a supplier.");
    return;
  }
  if (supplier === "not_on_list") {
    showPriceModal("Check with Julia for supplier credit arrangement");
    return;
  }
  if (supplier === "crawford") {
    showPriceModal("Check with Julia to determine which insurer is involved");
    return;
  }
  const creditPercentage = supplierCredits[supplier];
  if (typeof creditPercentage === "undefined") {
    alert("No credit data available for the selected supplier.");
    return;
  }
  if (creditPercentage === 0) {
    document.getElementById('creditTotal').textContent = "no credit";
  } else {
    const adjustedCost = combinedCost * (1 + creditPercentage);
    document.getElementById('creditTotal').textContent = "£" + adjustedCost.toFixed(2);
  }
}
