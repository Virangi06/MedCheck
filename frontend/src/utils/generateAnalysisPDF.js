import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const generateAnalysisPDF = async (analysis, inputData, healthProfile, userName, createdAt) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper functions
    const addText = (text, x, y, options = {}) => {
      const { size = 12, weight = 'normal', color = '#0f172a', align = 'left' } = options;
      doc.setFontSize(size);
      doc.setFont('helvetica', weight);
      doc.setTextColor(color.startsWith('#') ? parseInt(color.slice(1), 16) : 0);
      doc.text(text, x, y, { maxWidth: contentWidth - (x - margin), align });
    };

    const addSection = (title) => {
      if (yPosition > pageHeight - 40) {
        doc.addPage();
        yPosition = margin;
      }
      addText(title, margin, yPosition, { size: 14, weight: 'bold', color: '#0284c7' });
      yPosition += 8;
      doc.setDrawColor(2, 132, 199);
      doc.line(margin, yPosition, pageWidth - margin, yPosition);
      yPosition += 6;
    };

    const addBulletList = (items, indent = 0) => {
      items.forEach((item) => {
        if (yPosition > pageHeight - 20) {
          doc.addPage();
          yPosition = margin;
        }
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(75, 85, 99);
        doc.text(`• ${item}`, margin + indent + 5, yPosition, { maxWidth: contentWidth - indent - 5 });
        yPosition += 6;
      });
    };

    const addKeyValue = (key, value) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = margin;
      }
      if (!value || value === 'None' || value === '') return;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`${key}:`, margin, yPosition);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(String(value), margin + 40, yPosition, { maxWidth: contentWidth - 45 });
      yPosition += 6;
    };

    // ── HEADER ──
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(2, 132, 199);
    doc.text('MedCheck', margin, yPosition);
    yPosition += 12;

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('Medical Analysis Report', margin, yPosition);
    yPosition += 10;

    // Report metadata
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated: ${new Date(createdAt).toLocaleDateString('en-IN')} | Patient: ${userName}`, margin, yPosition);
    yPosition += 8;

    // ── PATIENT PROFILE ──
    if (healthProfile) {
      addSection('📋 Patient Profile');
      const profileGrid = [
        [`Age: ${healthProfile.age || '—'}`, `Gender: ${healthProfile.gender || '—'}`],
        [`Height: ${healthProfile.height ? healthProfile.height + ' cm' : '—'}`, `Weight: ${healthProfile.weight ? healthProfile.weight + ' kg' : '—'}`],
      ];
      profileGrid.forEach((row) => {
        row.forEach((cell, idx) => {
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(75, 85, 99);
          doc.text(cell, margin + (idx * contentWidth / 2), yPosition);
        });
        yPosition += 6;
      });

      if (healthProfile.diseases && healthProfile.diseases !== 'None') {
        addKeyValue('Existing Diseases', healthProfile.diseases);
      }
      if (healthProfile.medications && healthProfile.medications !== 'None') {
        addKeyValue('Current Medications', healthProfile.medications);
      }
      if (healthProfile.allergies && healthProfile.allergies !== 'None') {
        addKeyValue('Allergies', healthProfile.allergies);
      }
      yPosition += 4;
    }

    // ── PRIMARY CONDITION ──
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFillColor(240, 249, 255);
    doc.rect(margin, yPosition - 2, contentWidth, 30, 'F');
    doc.setDrawColor(191, 219, 254);
    doc.rect(margin, yPosition - 2, contentWidth, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text('🏥 Primary Condition', margin + 5, yPosition + 3);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    const urgencyColor = analysis.urgencyLevel?.toLowerCase();
    if (urgencyColor === 'emergency') {
      doc.setTextColor(239, 68, 68);
    } else if (urgencyColor === 'high') {
      doc.setTextColor(249, 115, 22);
    } else if (urgencyColor === 'moderate') {
      doc.setTextColor(234, 179, 8);
    } else {
      doc.setTextColor(34, 197, 94);
    }
    doc.text(analysis.possibleCondition || 'Unknown Condition', margin + 5, yPosition + 11);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Urgency: ${analysis.urgencyLevel || 'N/A'}`, margin + 5, yPosition + 18);
    yPosition += 34;

    // Condition explanation
    if (analysis.conditionExplanation) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(analysis.conditionExplanation, margin, yPosition, { maxWidth: contentWidth });
      yPosition += 10;
    }

    // ── SYMPTOMS & DETAILS ──
    addSection('🩺 Symptoms & Details');
    addKeyValue('Symptoms', inputData.symptoms);
    addKeyValue('Duration', inputData.duration);
    addKeyValue('Severity', inputData.severity);
    addKeyValue('Affected Body Area', inputData.bodyArea);
    yPosition += 2;

    // ── RECOMMENDATIONS ──
    addSection('👨‍⚕️ Medical Recommendations');
    addKeyValue('Recommended Doctor Type', analysis.recommendedDoctor);
    addKeyValue('Recommended Specialist', analysis.recommendedSpecialist);
    yPosition += 2;

    // ── PRECAUTIONS ──
    if (analysis.precautions && analysis.precautions.length > 0) {
      addSection('⚠️ Home Care Precautions');
      addBulletList(analysis.precautions);
      yPosition += 2;
    }

    // ── MEDICINES ──
    if (analysis.recommendedMedicines && analysis.recommendedMedicines.length > 0) {
      addSection('💊 Suggested Medications');
      addBulletList(analysis.recommendedMedicines);
      yPosition += 2;
    }

    // ── DIET ──
    if (analysis.dietRecommendation) {
      addSection('🥗 Nutritional Guidance');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(analysis.dietRecommendation, margin, yPosition, { maxWidth: contentWidth });
      yPosition += 8;
    }

    // ── RECOVERY ──
    if (analysis.recoveryAdvice) {
      addSection('❤️ Recovery Support');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(analysis.recoveryAdvice, margin, yPosition, { maxWidth: contentWidth });
      yPosition += 8;
    }

    // ── WHEN TO SEE DOCTOR ──
    if (analysis.whenToSeeDoctor) {
      addSection('📅 When to See a Doctor');
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(75, 85, 99);
      doc.text(analysis.whenToSeeDoctor, margin, yPosition, { maxWidth: contentWidth });
      yPosition += 8;
    }

    // ── EMERGENCY WARNING ──
    if (analysis.emergencyWarning && ['high', 'emergency'].includes(analysis.urgencyLevel?.toLowerCase())) {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFillColor(254, 242, 242);
      doc.rect(margin, yPosition - 2, contentWidth, 20, 'F');
      doc.setDrawColor(254, 202, 202);
      doc.rect(margin, yPosition - 2, contentWidth, 20);

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(239, 68, 68);
      doc.text('⚠️ MEDICAL WARNING', margin + 5, yPosition + 4);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(153, 27, 27);
      doc.text(analysis.emergencyWarning, margin + 5, yPosition + 11, { maxWidth: contentWidth - 10 });
      yPosition += 24;
    }

    // ── NEARBY FACILITIES ──
    if (analysis.nearbyDoctors && analysis.nearbyDoctors.length > 0) {
      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = margin;
      }

      addSection('🏥 Nearby Medical Facilities');

      const doctorsToShow = analysis.nearbyDoctors.slice(0, 5);
      doctorsToShow.forEach((doctor, idx) => {
        if (yPosition > pageHeight - 30) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFillColor(248, 250, 252);
        doc.rect(margin, yPosition - 2, contentWidth, 22, 'F');
        doc.setDrawColor(226, 232, 240);
        doc.rect(margin, yPosition - 2, contentWidth, 22);

        doc.setFontSize(10);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text(`${idx + 1}. ${doctor.name}`, margin + 4, yPosition + 3);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 116, 139);
        const distance = typeof doctor.distance === 'number' ? doctor.distance.toFixed(1) : doctor.distance;
        doc.text(`${doctor.type} | 📍 ${distance} km | ${doctor.address}`, margin + 4, yPosition + 9, { maxWidth: contentWidth - 8 });

        if (doctor.phone) {
          doc.setTextColor(2, 132, 199);
          doc.text(`☎️ ${doctor.phone}`, margin + 4, yPosition + 15);
        }

        yPosition += 26;
      });
    }

    // ── FOOTER ──
    if (yPosition > pageHeight - 20) {
      doc.addPage();
      yPosition = margin;
    }

    yPosition = pageHeight - 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Disclaimer: This is an AI-generated analysis and not a substitute for professional medical diagnosis.', margin, yPosition);
    yPosition += 4;
    doc.text('Please consult with a qualified healthcare professional for accurate diagnosis and treatment.', margin, yPosition);

    // Download
    const fileName = `MedCheck_Analysis_${new Date(createdAt).toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);

    console.log('✅ PDF generated and downloaded:', fileName);
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    alert('Failed to generate PDF. Please try again.');
  }
};

export default generateAnalysisPDF;
