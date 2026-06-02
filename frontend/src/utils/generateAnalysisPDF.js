import jsPDF from 'jspdf';

const generateAnalysisPDF = (analysis, inputData, healthProfile, userName, createdAt) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Helper functions
    const addNewPage = () => {
      doc.addPage();
      yPosition = margin;
    };

    const checkPageSpace = (neededSpace = 20) => {
      if (yPosition + neededSpace > pageHeight - 10) {
        addNewPage();
      }
    };

    const addTitle = (text) => {
      checkPageSpace(15);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text(text, margin, yPosition);
      yPosition += 12;
    };

    const addSubtitle = (text) => {
      checkPageSpace(12);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(text, margin, yPosition);
      yPosition += 7;

      doc.setDrawColor(200, 200, 200);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
    };

    const addWrappedText = (text, fontSize = 10, isBold = false) => {
      if (!text) return;
      checkPageSpace(8);

      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      doc.setTextColor(isBold ? 15 : 50, isBold ? 23 : 50, isBold ? 42 : 50);

      const lines = doc.splitTextToSize(String(text), contentWidth - 2);
      doc.text(lines, margin + 1, yPosition);
      yPosition += lines.length * 5 + 2;
    };

    const addKeyValue = (key, value) => {
      if (!value || value === 'None' || value === '' || value === '-') return;
      checkPageSpace(10);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${key}:`, margin, yPosition);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(10);

      // Calculate remaining width after the key
      const keyWidth = 50;
      const remainingWidth = contentWidth - keyWidth;

      const valueLines = doc.splitTextToSize(String(value), remainingWidth - 3);
      const lineHeight = 5;

      valueLines.forEach((line, idx) => {
        if (idx === 0) {
          doc.text(line, margin + keyWidth, yPosition);
        } else {
          checkPageSpace(6);
          doc.text(line, margin + keyWidth, yPosition);
        }
        yPosition += lineHeight;
      });

      yPosition += 2;
    };

    const addBulletList = (title, items) => {
      if (!items || items.length === 0) return;
      checkPageSpace(15);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(title, margin, yPosition);
      yPosition += 6;

      items.forEach((item) => {
        checkPageSpace(8);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);

        const bulletText = `• ${item}`;
        const lines = doc.splitTextToSize(bulletText, contentWidth - 4);

        lines.forEach((line, idx) => {
          if (idx === 0) {
            doc.text(line, margin + 2, yPosition);
          } else {
            doc.text(line, margin + 4, yPosition);
          }
          yPosition += 5;
        });
      });
      yPosition += 3;
    };

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    };

    // ===== HEADER SECTION =====
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('MEDCHECK', margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0, 0, 0);
    doc.text('Medical Analysis Report', margin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Report Generated: ${formatDate(createdAt)}`, margin, yPosition);
    yPosition += 4;
    doc.text(`Patient Name: ${userName}`, margin, yPosition);
    yPosition += 7;

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 6;

    // ===== PATIENT PROFILE SECTION =====
    if (healthProfile) {
      addSubtitle('PATIENT PROFILE');

      const profileItems = [];
      if (healthProfile.age) profileItems.push(`Age: ${healthProfile.age} years`);
      if (healthProfile.gender) profileItems.push(`Gender: ${healthProfile.gender}`);
      if (healthProfile.height) profileItems.push(`Height: ${healthProfile.height} cm`);
      if (healthProfile.weight) profileItems.push(`Weight: ${healthProfile.weight} kg`);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);

      const profileText = profileItems.join('  |  ');
      const lines = doc.splitTextToSize(profileText, contentWidth - 2);
      doc.text(lines, margin + 1, yPosition);
      yPosition += lines.length * 5 + 3;

      addKeyValue('Existing Medical Conditions', healthProfile.diseases);
      addKeyValue('Current Medications', healthProfile.medications);
      addKeyValue('Known Allergies', healthProfile.allergies);
      yPosition += 2;
    }

    // ===== SYMPTOMS AND INPUT SECTION =====
    addSubtitle('SYMPTOM INFORMATION');
    addKeyValue('Reported Symptoms', inputData.symptoms);
    addKeyValue('Duration of Symptoms', inputData.duration);
    addKeyValue('Severity Level', inputData.severity);
    addKeyValue('Affected Body Area', inputData.bodyArea);
    yPosition += 2;

    // ===== AI ANALYSIS RESULTS =====
    addSubtitle('MEDICAL ANALYSIS RESULTS');

    if (analysis.possibleCondition) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('Primary Condition:', margin, yPosition);
      yPosition += 5;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 50, 50);
      const conditionLines = doc.splitTextToSize(analysis.possibleCondition, contentWidth - 2);
      doc.text(conditionLines, margin + 1, yPosition);
      yPosition += conditionLines.length * 5 + 3;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.setFontSize(9);
      doc.text(`Urgency Level: ${analysis.urgencyLevel || 'Not Specified'}`, margin + 1, yPosition);
      yPosition += 5;
    }

    if (analysis.conditionExplanation) {
      addWrappedText(analysis.conditionExplanation, 10, false);
      yPosition += 2;
    }

    // ===== RECOMMENDATIONS SECTION =====
    addSubtitle('MEDICAL RECOMMENDATIONS');
    addKeyValue('Recommended Doctor Type', analysis.recommendedDoctor);
    addKeyValue('Recommended Specialist', analysis.recommendedSpecialist);
    yPosition += 2;

    // ===== PRECAUTIONS SECTION =====
    if (analysis.precautions && analysis.precautions.length > 0) {
      addBulletList('Important Precautions:', analysis.precautions);
    }

    // ===== MEDICINES SECTION =====
    if (analysis.recommendedMedicines && analysis.recommendedMedicines.length > 0) {
      addBulletList('Suggested Medications:', analysis.recommendedMedicines);
    }

    // ===== DIET AND RECOVERY =====
    if (analysis.dietRecommendation) {
      checkPageSpace(20);
      addSubtitle('NUTRITION RECOMMENDATIONS');
      addWrappedText(analysis.dietRecommendation);
    }

    if (analysis.recoveryAdvice) {
      checkPageSpace(20);
      addSubtitle('RECOVERY GUIDANCE');
      addWrappedText(analysis.recoveryAdvice);
    }

    if (analysis.whenToSeeDoctor) {
      checkPageSpace(20);
      addSubtitle('WHEN TO CONSULT A DOCTOR');
      addWrappedText(analysis.whenToSeeDoctor);
    }

    // ===== EMERGENCY WARNING =====
    if (analysis.emergencyWarning && ['high', 'emergency'].includes((analysis.urgencyLevel || '').toLowerCase())) {
      checkPageSpace(25);

      doc.setFillColor(255, 240, 240);
      const warningBoxHeight = 22;
      doc.rect(margin, yPosition - 5, contentWidth, warningBoxHeight, 'F');
      doc.setDrawColor(255, 200, 200);
      doc.rect(margin, yPosition - 5, contentWidth, warningBoxHeight);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(200, 0, 0);
      doc.text('IMPORTANT MEDICAL WARNING', margin + 3, yPosition);
      yPosition += 6;

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 0, 0);
      const warningLines = doc.splitTextToSize(analysis.emergencyWarning, contentWidth - 6);
      doc.text(warningLines, margin + 3, yPosition);
      yPosition += warningLines.length * 4 + 8;
    }

    // ===== NEARBY MEDICAL FACILITIES =====
    if (analysis.nearbyDoctors && analysis.nearbyDoctors.length > 0) {
      checkPageSpace(30);
      addSubtitle('NEARBY MEDICAL FACILITIES');

      const doctorsToShow = analysis.nearbyDoctors.slice(0, 5);
      doctorsToShow.forEach((doctor, idx) => {
        checkPageSpace(20);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        const facilityName = `${idx + 1}. ${doctor.name}`;
        const facilityLines = doc.splitTextToSize(facilityName, contentWidth - 2);
        doc.text(facilityLines, margin + 1, yPosition);
        yPosition += facilityLines.length * 5;

        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);

        const distance = typeof doctor.distance === 'number' ? doctor.distance.toFixed(1) : doctor.distance;
        const typeText = `Type: ${doctor.type || 'Medical Facility'}`;
        doc.text(typeText, margin + 3, yPosition);
        yPosition += 4;

        const addressText = `Address: ${doctor.address}`;
        const addressLines = doc.splitTextToSize(addressText, contentWidth - 4);
        addressLines.forEach((line) => {
          doc.text(line, margin + 3, yPosition);
          yPosition += 4;
        });

        const distanceText = `Distance: ${distance} km away`;
        doc.text(distanceText, margin + 3, yPosition);
        yPosition += 4;

        if (doctor.phone) {
          const phoneText = `Phone: ${doctor.phone}`;
          doc.text(phoneText, margin + 3, yPosition);
          yPosition += 4;
        }

        yPosition += 2;
      });
    }

    // ===== FOOTER =====
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);

    const footerY = pageHeight - 12;
    const disclaimerLine1 = 'DISCLAIMER: This is an AI-generated medical analysis and is not a substitute for';
    const disclaimerLine2 = 'professional medical diagnosis, treatment, or advice. Please consult with a qualified';
    const disclaimerLine3 = 'healthcare professional for accurate diagnosis and treatment.';

    doc.text(disclaimerLine1, margin, footerY);
    doc.text(disclaimerLine2, margin, footerY + 3);
    doc.text(disclaimerLine3, margin, footerY + 6);

    // Download PDF
    const fileName = `MedCheck_Analysis_${new Date(createdAt).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    console.log('✅ Professional PDF generated:', fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

export default generateAnalysisPDF;
