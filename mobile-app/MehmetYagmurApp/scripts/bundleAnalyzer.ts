// Bundle Analyzer Configuration
// Analyzes bundle size and optimization opportunities

const fs = require('fs');
const path = require('path');

interface BundleAnalysis {
  totalSize: number;
  components: { name: string; size: number; percentage: number }[];
  services: { name: string; size: number; percentage: number }[];
  assets: { name: string; size: number; percentage: number }[];
  optimization: {
    unnecessaryFiles: string[];
    largeComponents: string[];
    recommendations: string[];
  };
}

class BundleAnalyzer {
  private projectPath: string;
  private analysis: BundleAnalysis;

  constructor(projectPath: string = __dirname) {
    this.projectPath = projectPath;
    this.analysis = {
      totalSize: 0,
      components: [],
      services: [],
      assets: [],
      optimization: {
        unnecessaryFiles: [],
        largeComponents: [],
        recommendations: []
      }
    };
  }

  /**
   * Analyze file sizes in directory
   */
  private analyzeDirectory(dirPath: string, category: 'components' | 'services' | 'assets'): void {
    if (!fs.existsSync(dirPath)) {
      return;
    }

    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    files.forEach(file => {
      if (file.isFile()) {
        const filePath = path.join(dirPath, file.name);
        const stats = fs.statSync(filePath);
        const sizeInKB = Math.round(stats.size / 1024 * 100) / 100;
        
        this.analysis[category].push({
          name: file.name,
          size: sizeInKB,
          percentage: 0 // Will be calculated later
        });
        
        this.analysis.totalSize += sizeInKB;
        
        // Flag large files for optimization
        if (sizeInKB > 50) { // Files larger than 50KB
          this.analysis.optimization.largeComponents.push(
            `${category}/${file.name} (${sizeInKB}KB)`
          );
        }
        
      } else if (file.isDirectory()) {
        // Recursively analyze subdirectories
        this.analyzeDirectory(path.join(dirPath, file.name), category);
      }
    });
  }

  /**
   * Calculate percentages after total size is known
   */
  private calculatePercentages(): void {
    ['components', 'services', 'assets'].forEach(category => {
      this.analysis[category as keyof BundleAnalysis].forEach((item: any) => {
        item.percentage = Math.round((item.size / this.analysis.totalSize) * 100 * 100) / 100;
      });
    });
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(): void {
    const recommendations: string[] = [];
    
    // Check for duplicate dependencies
    const componentNames = this.analysis.components.map(c => c.name.toLowerCase());
    const duplicates = componentNames.filter((name, index) => 
      componentNames.indexOf(name) !== index
    );
    
    if (duplicates.length > 0) {
      recommendations.push(`Remove duplicate components: ${duplicates.join(', ')}`);
    }
    
    // Check bundle size
    if (this.analysis.totalSize > 2000) { // More than 2MB
      recommendations.push('Consider code splitting to reduce initial bundle size');
      recommendations.push('Implement lazy loading for non-critical components');
    }
    
    // Check large files
    if (this.analysis.optimization.largeComponents.length > 0) {
      recommendations.push('Optimize large files using compression or code splitting');
      recommendations.push('Consider moving large assets to CDN');
    }
    
    // Performance recommendations
    recommendations.push('Enable tree shaking to remove unused code');
    recommendations.push('Use React.memo() for expensive components');
    recommendations.push('Implement virtualization for large lists');
    recommendations.push('Optimize images using WebP format');
    
    this.analysis.optimization.recommendations = recommendations;
  }

  /**
   * Run complete bundle analysis
   */
  analyze(): BundleAnalysis {
    console.log('📊 Starting Bundle Analysis...');
    
    // Reset analysis
    this.analysis = {
      totalSize: 0,
      components: [],
      services: [],
      assets: [],
      optimization: {
        unnecessaryFiles: [],
        largeComponents: [],
        recommendations: []
      }
    };
    
    // Analyze different directories
    this.analyzeDirectory(path.join(this.projectPath, 'components'), 'components');
    this.analyzeDirectory(path.join(this.projectPath, 'services'), 'services');
    this.analyzeDirectory(path.join(this.projectPath, 'hooks'), 'services'); // Group hooks with services
    this.analyzeDirectory(path.join(this.projectPath, 'assets'), 'assets');
    
    // Calculate percentages
    this.calculatePercentages();
    
    // Generate recommendations
    this.generateRecommendations();
    
    console.log(`📦 Total Bundle Size: ${this.analysis.totalSize.toFixed(2)}KB`);
    console.log(`🧩 Components: ${this.analysis.components.length} files`);
    console.log(`⚙️ Services: ${this.analysis.services.length} files`);
    console.log(`🎨 Assets: ${this.analysis.assets.length} files`);
    console.log(`💡 Optimization Opportunities: ${this.analysis.optimization.recommendations.length}`);
    
    return this.analysis;
  }

  /**
   * Generate detailed report
   */
  generateReport(): string {
    const analysis = this.analyze();
    
    let report = '';
    report += '# 📊 Bundle Analysis Report\n\n';
    report += `**Total Bundle Size:** ${analysis.totalSize.toFixed(2)}KB\n\n`;
    
    // Components analysis
    report += '## 🧩 Components Analysis\n\n';
    const sortedComponents = analysis.components.sort((a, b) => b.size - a.size);
    sortedComponents.forEach(component => {
      report += `- **${component.name}**: ${component.size}KB (${component.percentage}%)\n`;
    });
    report += '\n';
    
    // Services analysis
    report += '## ⚙️ Services Analysis\n\n';
    const sortedServices = analysis.services.sort((a, b) => b.size - a.size);
    sortedServices.forEach(service => {
      report += `- **${service.name}**: ${service.size}KB (${service.percentage}%)\n`;
    });
    report += '\n';
    
    // Assets analysis
    if (analysis.assets.length > 0) {
      report += '## 🎨 Assets Analysis\n\n';
      const sortedAssets = analysis.assets.sort((a, b) => b.size - a.size);
      sortedAssets.forEach(asset => {
        report += `- **${asset.name}**: ${asset.size}KB (${asset.percentage}%)\n`;
      });
      report += '\n';
    }
    
    // Optimization recommendations
    report += '## 💡 Optimization Recommendations\n\n';
    analysis.optimization.recommendations.forEach(rec => {
      report += `- ${rec}\n`;
    });
    report += '\n';
    
    // Large components
    if (analysis.optimization.largeComponents.length > 0) {
      report += '## ⚠️ Large Components (>50KB)\n\n';
      analysis.optimization.largeComponents.forEach(comp => {
        report += `- ${comp}\n`;
      });
      report += '\n';
    }
    
    report += '---\n';
    report += `*Analysis generated on ${new Date().toISOString()}*\n`;
    
    return report;
  }

  /**
   * Save analysis to file
   */
  saveReport(outputPath?: string): void {
    const report = this.generateReport();
    const filePath = outputPath || path.join(this.projectPath, 'BUNDLE_ANALYSIS.md');
    
    fs.writeFileSync(filePath, report, 'utf8');
    console.log(`📄 Bundle analysis report saved to: ${filePath}`);
  }
}

// CLI usage
if (require.main === module) {
  const analyzer = new BundleAnalyzer();
  analyzer.saveReport();
}

export default BundleAnalyzer;